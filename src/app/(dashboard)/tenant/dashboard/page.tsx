
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { PropertyCard } from "@/components/property-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, IndianRupee, Loader2, Filter, LayoutGrid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function TenantDashboard() {
  const db = useFirestore();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [rentFilter, setRentFilter] = useState("any");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (db) {
      fetchProperties();
    }
  }, [db, cityFilter]);

  const fetchProperties = async () => {
    if (!db) return;
    setLoading(true);
    try {
      let q = query(
        collection(db, "properties"),
        where("status", "==", "approved")
      );

      if (cityFilter !== "all") {
        q = query(q, where("city", "==", cityFilter));
      }

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      results.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setProperties(results);
    } catch (error: any) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = 
      p.pgName.toLowerCase().includes(search.toLowerCase()) ||
      p.area.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    
    const matchesRent = rentFilter === "any" || p.rent <= parseInt(rentFilter);
    
    return matchesSearch && matchesRent;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-extrabold font-headline text-foreground tracking-tight">
          Explore Stays
        </h1>
        <p className="text-muted-foreground font-medium">Verified PGs and Hostels for a comfortable living.</p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              className="pl-12 h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white transition-all text-base font-medium"
              placeholder="Where do you want to live?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="h-14 min-w-[140px] rounded-2xl bg-muted/20 border-muted font-bold">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="City" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rentFilter} onValueChange={setRentFilter}>
              <SelectTrigger className="h-14 min-w-[140px] rounded-2xl bg-muted/20 border-muted font-bold">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Budget" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="any">Any Rent</SelectItem>
                <SelectItem value="5000">₹5,000</SelectItem>
                <SelectItem value="10000">₹10,000</SelectItem>
                <SelectItem value="15000">₹15,000</SelectItem>
                <SelectItem value="20000">₹20,000</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-14 rounded-2xl border-muted bg-muted/20 md:flex hidden">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-headline">
          {filteredProperties.length} Properties Found
        </h3>
        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded-lg h-8 w-8 p-0"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded-lg h-8 w-8 p-0"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
              <Skeleton className="h-6 w-3/4 rounded-xl" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} role="tenant" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-dashed">
          <div className="bg-muted p-10 rounded-full mb-6">
            <Search className="h-16 w-16 text-muted-foreground opacity-20" />
          </div>
          <h3 className="text-2xl font-bold font-headline mb-2">No matches found</h3>
          <p className="text-muted-foreground max-w-md px-6">We couldn't find any properties matching your current filters. Try expanding your search area or adjusting your budget.</p>
          <Button 
            variant="link" 
            className="text-primary font-bold mt-4 h-auto"
            onClick={() => {
              setSearch("");
              setCityFilter("all");
              setRentFilter("any");
            }}
          >
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  );
}
