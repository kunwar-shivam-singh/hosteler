
"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, IndianRupee, Bed, ChevronRight, Clock, ShieldCheck, ShieldAlert } from "lucide-react";
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
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };

  const statusIcons = {
    pending: <Clock className="h-3 w-3 mr-1" />,
    approved: <ShieldCheck className="h-3 w-3 mr-1" />,
    rejected: <ShieldAlert className="h-3 w-3 mr-1" />,
  };

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl group flex flex-col h-full bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images?.[0] || `https://picsum.photos/seed/${property.id}/600/400`}
          alt={property.pgName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          data-ai-hint="property room"
        />
        {role !== "tenant" && (
          <Badge className={`absolute top-3 right-3 ${statusColors[property.status]} border font-semibold flex items-center`}>
            {statusIcons[property.status]}
            {property.status.toUpperCase()}
          </Badge>
        )}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-primary text-white font-bold border-none shadow-lg px-3 py-1">
            <IndianRupee className="h-3 w-3 mr-0.5" /> {property.rent}/mo
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <h3 className="text-xl font-bold font-headline line-clamp-1 group-hover:text-primary transition-colors">
          {property.pgName}
        </h3>
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
          <span className="line-clamp-1">{property.area}, {property.city}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 flex-1">
        <div className="flex gap-4 text-sm font-medium">
          <div className="flex items-center text-foreground">
            <Bed className="h-4 w-4 mr-1.5 text-primary" />
            {property.availableBeds} beds left
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {property.roomTypes.slice(0, 2).map((type) => (
            <Badge key={type} variant="secondary" className="text-[10px] px-2 py-0">
              {type}
            </Badge>
          ))}
          {property.roomTypes.length > 2 && <span className="text-[10px] text-muted-foreground">+{property.roomTypes.length - 2} more</span>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full rounded-xl" variant={role === "tenant" ? "default" : "outline"}>
          <Link href={`/${role}/property/${property.id}`}>
            {role === "tenant" ? "View Details" : "Manage Listing"} <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
