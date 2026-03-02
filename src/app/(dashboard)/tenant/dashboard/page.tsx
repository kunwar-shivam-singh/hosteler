"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { PropertyCard } from "@/components/property-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, MapPin, IndianRupee, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TenantDashboard() {
  const db = useFirestore();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [rentFilter, setRentFilter] = useState("any");

  useEffect(() => {
    if (db) {
      fetchProperties();
    }
  }, [db, cityFilter, rentFilter]);

  const fetchProperties = async () => {
    if (!db) return;
    setLoading(true);
    try {
      let q = query(
        collection(db, "properties"),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc")
      );

      if (cityFilter !== "all") {
        q = query(q, where("city", "==", cityFilter));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (rentFilter !== "any") {
        const maxRent = parseInt(rentFilter);
        results = results.filter((p: any) => p.rent <= maxRent);
      }

      setProperties(results);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p =>
    p.pgName.toLowerCase().includes(search.toLowerCase()) ||
    p.area.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold font-headline">Find Your Perfect Stay</h1>
          <p className="text-muted-foreground">Discover verified PGs and Hostels near you.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 h-12 rounded-xl"
            placeholder="Search by area or PG name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[140px]">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="rounded-xl">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="City" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <Select value={rentFilter} onValueChange={setRentFilter}>
              <SelectTrigger className="rounded-xl">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Max Rent" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Rent</SelectItem>
                <SelectItem value="5000">Under ₹5,000</SelectItem>
                <SelectItem value="10000">Under ₹10,000</SelectItem>
                <SelectItem value="15000">Under ₹15,000</SelectItem>
                <SelectItem value="20000">Under ₹20,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Finding the best options for you...</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} role="tenant" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-muted p-6 rounded-full mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">No results found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          <Button variant="link" className="text-primary mt-2" onClick={() => { setCityFilter("all"); setRentFilter("any"); setSearch(""); }}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
