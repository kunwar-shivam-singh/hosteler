
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  IndianRupee, 
  Bed, 
  Phone, 
  ArrowLeft, 
  Loader2, 
  MessageSquare,
  CheckCircle2,
  Calendar,
  Share2
} from "lucide-react";
import Image from "next/image";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push("/tenant/dashboard");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) return null;

  const whatsappLink = `https://wa.me/${property.contactNumber.replace(/\D/g, "")}?text=Hi, I am interested in your PG listing: ${property.pgName} found on PG Locator.`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Button variant="ghost" className="rounded-xl" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden shadow-lg border bg-white">
        <div className="relative aspect-video md:aspect-square">
          <Image 
            src={property.images?.[0] || "https://picsum.photos/seed/p1/800/800"} 
            alt={property.pgName} 
            fill 
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 p-2 hidden md:grid">
          {property.images?.slice(1, 5).map((img: string, i: number) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={img} alt="Property" fill className="object-cover" />
            </div>
          ))}
          {!property.images || property.images.length <= 1 && (
             <div className="col-span-2 flex items-center justify-center bg-muted/30 rounded-xl text-muted-foreground text-sm italic">
               No additional photos
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold font-headline">{property.pgName}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  {property.address}, {property.area}, {property.city}
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-1">
                ₹{property.rent} <span className="text-xs ml-1 font-normal opacity-70">/ month</span>
              </Badge>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg"><Bed className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground leading-none">Available</p>
                  <p className="font-bold">{property.availableBeds} Beds</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg"><Calendar className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground leading-none">Listed on</p>
                  <p className="font-bold">{new Date(property.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
            <h2 className="text-xl font-bold font-headline">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
            <h2 className="text-xl font-bold font-headline">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities?.map((item: string) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-primary/10 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold font-headline">Interested?</h2>
            <div className="space-y-3">
              <Button asChild className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90">
                <a href={`tel:${property.contactNumber}`}>
                  <Phone className="mr-2 h-5 w-5" /> Call Owner
                </a>
              </Button>
              <Button asChild className="w-full h-14 text-lg font-bold rounded-2xl bg-[#25D366] hover:bg-[#25D366]/90 border-none">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp
                </a>
              </Button>
            </div>
            <div className="pt-4 border-t text-center">
              <p className="text-xs text-muted-foreground">Always mention you found this on <span className="font-bold text-primary">PG Locator</span></p>
            </div>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => {
              navigator.share?.({ title: property.pgName, url: window.location.href });
            }}>
              <Share2 className="mr-2 h-4 w-4" /> Share Listing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
