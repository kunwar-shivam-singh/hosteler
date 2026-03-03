
"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, IndianRupee, Bed, ChevronRight, Clock, ShieldCheck, ShieldAlert, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  pgName: string;
  city: string;
  area: string;
  rent: number;
  availableBeds: number;
  images: string[];
  status: "pending" | "approved" | "rejected";
  roomTypes: string[];
}

export function PropertyCard({ property, role }: { property: Property; role: "tenant" | "owner" | "admin" }) {
  const statusColors = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };

  const statusIcons = {
    pending: <Clock className="h-3 w-3 mr-1" />,
    approved: <ShieldCheck className="h-3 w-3 mr-1" />,
    rejected: <ShieldAlert className="h-3 w-3 mr-1" />,
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] group flex flex-col h-full bg-white relative">
      <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-[1.5rem]">
        <Image
          src={property.images?.[0] || `https://picsum.photos/seed/${property.id}/600/400`}
          alt={property.pgName}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint="property room"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {role !== "tenant" && (
          <Badge className={`absolute top-4 right-4 ${statusColors[property.status]} border-none font-bold px-3 py-1 shadow-sm backdrop-blur-md bg-white/90`}>
            {statusIcons[property.status]}
            {property.status.toUpperCase()}
          </Badge>
        )}
        
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black">4.8</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
           <Button asChild size="sm" className="w-full rounded-xl font-bold">
              <Link href={`/${role}/property/${property.id}`}>View Details</Link>
           </Button>
        </div>
      </div>

      <CardHeader className="p-6 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-black font-headline line-clamp-1 group-hover:text-primary transition-colors mb-1">
              {property.pgName}
            </h3>
            <div className="flex items-center text-muted-foreground text-xs font-medium">
              <MapPin className="h-3 w-3 mr-1 shrink-0 text-primary" />
              <span className="line-clamp-1">{property.area}, {property.city}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-primary leading-none flex items-center justify-end">
              <IndianRupee className="h-4 w-4" />{property.rent.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">per month</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-4 flex-1">
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-xl">
            <Bed className="h-4 w-4 text-primary" />
            {property.availableBeds} beds
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-xl">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            Verified
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.roomTypes.slice(0, 2).map((type) => (
            <Badge key={type} variant="secondary" className="text-[10px] font-bold px-3 py-0.5 rounded-lg bg-primary/5 text-primary border-none">
              {type}
            </Badge>
          ))}
          {property.roomTypes.length > 2 && <span className="text-[10px] text-muted-foreground font-bold self-center">+{property.roomTypes.length - 2}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
