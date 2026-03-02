"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { useAuth } from "@/context/auth-context";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Home, MessageSquarePlus, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function OwnerDashboard() {
  const { user, userName } = useAuth();
  const { firestore: db } = useFirebase();
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && db) {
      fetchMyProperties();
    }
  }, [user, db]);

  const fetchMyProperties = async () => {
    if (!db || !user) return;
    setLoading(true);
    try {
      // Simple query to avoid composite index issues - filter by status in state if needed
      const q = query(
        collection(db, "properties"),
        where("ownerId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side sort to ensure consistent display
      results.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      setProperties(results);
    } catch (error: any) {
      console.error("Error fetching properties:", error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: "Could not fetch your properties. Check your database permissions."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome, {userName}!</h1>
          <p className="text-muted-foreground">Manage your PG and Hostel listings.</p>
        </div>
        <Button asChild className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20">
          <Link href="/owner/add">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Listing
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total</p>
            <p className="text-xl font-bold">{properties.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-2xl">
            <MessageSquarePlus className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Approved</p>
            <p className="text-xl font-bold">{properties.filter(p => p.status === 'approved').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-2xl">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Pending</p>
            <p className="text-xl font-bold">{properties.filter(p => p.status === 'pending').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-2xl">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Rejected</p>
            <p className="text-xl font-bold">{properties.filter(p => p.status === 'rejected').length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Your Listings</h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground font-medium">Loading your properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} role="owner" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed text-center px-4">
            <div className="bg-muted p-6 rounded-full mb-4">
              <PlusCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No properties listed yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2">Start attracting tenants by adding your first PG or Hostel listing today!</p>
            <Button asChild className="mt-6 rounded-xl" size="lg">
              <Link href="/owner/add">Add Listing Now</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
