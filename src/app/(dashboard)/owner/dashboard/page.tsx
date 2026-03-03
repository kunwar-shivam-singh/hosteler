
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { useAuth } from "@/context/auth-context";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Home, CheckCircle, Clock, XCircle, TrendingUp, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

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
      // Removed orderBy to avoid requiring composite indexes
      const q = query(
        collection(db, "properties"),
        where("ownerId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side sort
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
        description: "Could not fetch your properties."
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Listings", value: properties.length, icon: Home, color: "bg-blue-50 text-blue-600" },
    { label: "Approved", value: properties.filter(p => p.status === 'approved').length, icon: CheckCircle, color: "bg-green-50 text-green-600" },
    { label: "Pending", value: properties.filter(p => p.status === 'pending').length, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Rejected", value: properties.filter(p => p.status === 'rejected').length, icon: XCircle, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold font-headline tracking-tight text-foreground">
            Hi, {userName?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Here's how your properties are performing.</p>
        </div>
        <Button asChild className="rounded-2xl h-14 px-8 shadow-xl shadow-primary/25 text-lg font-bold">
          <Link href="/owner/add">
            <PlusCircle className="mr-2 h-5 w-5" /> List New PG
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="dashboard-card border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-2xl`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground opacity-30" />
              </div>
              <p className="text-3xl font-black font-headline">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline">Manage Listings</h2>
            <Link href="/owner/dashboard" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground font-medium">Syncing data...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} role="owner" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed text-center px-10">
              <div className="bg-muted p-8 rounded-full mb-6">
                <PlusCircle className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-2xl font-bold font-headline">No listings found</h3>
              <p className="text-muted-foreground max-w-sm mt-2">Start earning by listing your first PG or Hostel today!</p>
              <Button asChild className="mt-8 rounded-2xl h-12 px-10" size="lg">
                <Link href="/owner/add">Add Listing Now</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Quick Insights</h2>
          <Card className="dashboard-card overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-primary p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Estimated Reach</p>
                <p className="text-4xl font-black font-headline">1,248</p>
                <p className="text-[10px] mt-4 font-medium bg-white/20 inline-block px-2 py-1 rounded-lg">+12% from last month</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-xl"><Users className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">Inquiries</p>
                    <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary w-[65%] rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-sm font-black">42</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-xl"><MessageSquare className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">Responses</p>
                    <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-accent w-[40%] rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-sm font-black">28</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
