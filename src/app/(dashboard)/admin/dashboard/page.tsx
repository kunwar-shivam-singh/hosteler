"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, Trash2, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function AdminDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (db) {
      fetchProperties();
    }
  }, [db]);

  const fetchProperties = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(results);
    } catch (error: any) {
      console.error("Error fetching properties:", error);
      toast({ variant: "destructive", title: "Fetch Failed", description: error.message || "Could not load properties." });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    if (!db) return;
    const docRef = doc(db, "properties", id);
    updateDocumentNonBlocking(docRef, { status });
    
    // Optimistic UI update
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    toast({ title: `Listing ${status}`, description: `The property is now ${status}.` });
  };

  const deleteListing = (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this listing permanently?")) return;
    
    const docRef = doc(db, "properties", id);
    deleteDocumentNonBlocking(docRef);
    
    // Optimistic UI update
    setProperties(prev => prev.filter(p => p.id !== id));
    toast({ title: "Listing Deleted", description: "The listing has been removed." });
  };

  const pendingListings = properties.filter(p => p.status === "pending");
  const otherListings = properties.filter(p => p.status !== "pending");

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-headline">Admin Moderation</h1>
        <p className="text-muted-foreground">Approve or reject listings to keep the platform clean.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Pending Approvals <Badge variant="secondary">{pendingListings.length}</Badge>
        </h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : pendingListings.length > 0 ? (
          <div className="space-y-4">
            {pendingListings.map(listing => (
              <Card key={listing.id} className="overflow-hidden border-primary/20 bg-primary/5">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-24 h-24 relative rounded-xl overflow-hidden shrink-0">
                    <Image src={listing.images?.[0] || "https://picsum.photos/seed/admin/200/200"} fill className="object-cover" alt="Property" />
                  </div>
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg">{listing.pgName}</h3>
                    <div className="flex items-center justify-center sm:justify-start text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" /> {listing.area}, {listing.city}
                    </div>
                    <p className="text-xs font-medium text-primary">Rent: ₹{listing.rent} | Contact: {listing.contactNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus(listing.id, "approved")} className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(listing.id, "rejected")}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/tenant/property/${listing.id}`} target="_blank"><ExternalLink className="h-4 w-4" /></a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">No pending listings to review.</p>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">History & Other Listings</h2>
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-4 font-bold">Property</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Owner</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {otherListings.map(listing => (
                  <tr key={listing.id} className="hover:bg-muted/30">
                    <td className="p-4">
                      <div className="font-bold">{listing.pgName}</div>
                      <div className="text-xs text-muted-foreground">{listing.city}</div>
                    </td>
                    <td className="p-4">
                      <Badge className={listing.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {listing.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs">
                      {listing.contactNumber}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteListing(listing.id)} className="text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
