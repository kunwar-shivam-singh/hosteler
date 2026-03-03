
"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, Trash2, MapPin, ExternalLink, ShieldCheck, Users, Home, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      toast({ variant: "destructive", title: "Fetch Failed", description: "Could not load listings." });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    if (!db) return;
    const docRef = doc(db, "properties", id);
    updateDocumentNonBlocking(docRef, { status });
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    toast({ title: `Listing ${status}`, description: `The property is now ${status}.` });
  };

  const deleteListing = (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this listing permanently?")) return;
    const docRef = doc(db, "properties", id);
    deleteDocumentNonBlocking(docRef);
    setProperties(prev => prev.filter(p => p.id !== id));
    toast({ title: "Listing Deleted", description: "The listing has been removed." });
  };

  const pendingListings = properties.filter(p => p.status === "pending");
  
  const stats = [
    { label: "Total Listings", value: properties.length, icon: Home, color: "text-blue-600 bg-blue-50" },
    { label: "Pending Approval", value: pendingListings.length, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Approved PGs", value: properties.filter(p => p.status === 'approved').length, icon: ShieldCheck, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight">Ops Center</h1>
        <p className="text-muted-foreground font-medium">Global moderation and platform operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="dashboard-card">
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-4xl font-black font-headline">{stat.value}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-3xl`}>
                <stat.icon className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
          Moderate Queue <Badge variant="secondary" className="rounded-xl px-3 py-1 font-black">{pendingListings.length}</Badge>
        </h2>
        {loading ? (
          <div className="flex justify-center py-20 bg-white rounded-[2rem] border">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : pendingListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {pendingListings.map(listing => (
              <Card key={listing.id} className="dashboard-card overflow-hidden group">
                <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-32 h-32 relative rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                    <Image src={listing.images?.[0] || "https://picsum.photos/seed/admin/300/300"} fill className="object-cover" alt="Property" />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="font-black text-xl truncate">{listing.pgName}</h3>
                      <Badge className="bg-amber-100 text-amber-700 font-bold border-none text-[10px]">NEW</Badge>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground font-medium">
                      <MapPin className="h-4 w-4 mr-1 text-primary" /> {listing.area}, {listing.city}
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-1">
                      <p className="text-sm font-bold text-primary">₹{listing.rent}/mo</p>
                      <p className="text-sm font-medium text-muted-foreground">Owner: {listing.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Button onClick={() => updateStatus(listing.id, "approved")} className="bg-green-600 hover:bg-green-700 rounded-xl px-6 font-bold shadow-lg shadow-green-200">
                      <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button variant="outline" onClick={() => updateStatus(listing.id, "rejected")} className="rounded-xl text-destructive hover:bg-destructive/10 border-destructive/20 font-bold">
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl" asChild>
                      <a href={`/tenant/property/${listing.id}`} target="_blank"><ExternalLink className="h-5 w-5" /></a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed">
            <ShieldCheck className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground font-bold italic">Queue is clear! No pending approvals.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Operations History</h2>
        <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 border-b">
                <tr>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Property</th>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Status</th>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Owner</th>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {properties.filter(p => p.status !== "pending").map(listing => (
                  <tr key={listing.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-base">{listing.pgName}</div>
                      <div className="text-xs text-muted-foreground font-medium">{listing.city}</div>
                    </td>
                    <td className="p-6">
                      <Badge className={`rounded-lg font-bold border-none px-3 py-1 ${
                        listing.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {listing.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <p className="font-medium text-xs">{listing.contactNumber}</p>
                    </td>
                    <td className="p-6 text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteListing(listing.id)} className="text-destructive hover:bg-destructive/10 rounded-xl">
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
