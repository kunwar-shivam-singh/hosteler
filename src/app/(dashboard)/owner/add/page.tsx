"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, ArrowLeft, X, Home, Sparkles } from "lucide-react";
import Image from "next/image";
import { AIListingEnhancer } from "@/components/ai-listing-enhancer";

const ROOM_TYPES = ["Single Sharing", "Double Sharing", "Triple Sharing", "Four Sharing"];
const AMENITIES_LIST = ["WiFi", "Laundry", "Meals Included", "AC", "Power Backup", "CCTV", "Gym", "Parking"];

export default function AddPropertyPage() {
  const { user, firestore: db, storage } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    pgName: "",
    city: "",
    area: "",
    address: "",
    rent: 0,
    availableBeds: 0,
    contactNumber: "",
    description: "",
    roomTypes: [] as string[],
    amenities: [] as string[],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSelection = (list: string[], item: string) => {
    return list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ variant: "destructive", title: "Auth Required", description: "You must be logged in to post." });
      return;
    }

    setIsLoading(true);

    try {
      const imageUrls: string[] = [];
      
      // Upload images sequentially to avoid browser hangs or timeouts
      if (images.length > 0) {
        for (const image of images) {
          try {
            const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const imagePath = `properties/${user.uid}/${fileName}`;
            const imageRef = ref(storage, imagePath);
            const uploadResult = await uploadBytes(imageRef, image);
            const url = await getDownloadURL(uploadResult.ref);
            imageUrls.push(url);
          } catch (uploadError: any) {
            console.error("Image upload failed for:", image.name, uploadError);
            toast({
              variant: "destructive",
              title: "Upload Failed",
              description: `Could not upload ${image.name}. Continuing...`,
            });
          }
        }
      }

      const propertiesRef = collection(db, "properties");
      // Initiate firestore write. This is non-blocking.
      addDocumentNonBlocking(propertiesRef, {
        ...formData,
        ownerId: user.uid,
        images: imageUrls,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      toast({ 
        title: "Listing Published!", 
        description: "Your PG is now pending approval." 
      });
      
      // Navigate away immediately as Firestore will sync in background
      router.push("/owner/dashboard");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({ 
        variant: "destructive", 
        title: "Submission Failed", 
        description: error.message || "Failed to save listing." 
      });
      setIsLoading(false);
    }
  };

  const applyAIResult = (description: string, amenities: string[]) => {
    // We update the description, but we DON'T force-add amenities
    // to give the user final choice in the UI.
    setFormData((prev) => ({
      ...prev,
      description
    }));
    
    toast({
      title: "AI Description Ready",
      description: "We've updated your description. Please review and select any suggested amenities below.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <Button variant="ghost" className="rounded-xl" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
      </Button>

      <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold font-headline">New Property</CardTitle>
              <CardDescription>Tell us about your PG/Hostel</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pgName">PG / Hostel Name</Label>
                <Input
                  id="pgName"
                  placeholder="Royal Stay PG"
                  required
                  value={formData.pgName}
                  onChange={(e) => setFormData({ ...formData, pgName: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  placeholder="+91 9876543210"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Bangalore"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area / Locality</Label>
                <Input
                  id="area"
                  placeholder="HSR Layout"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="Flat No, Building Name, Landmark"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rent">Monthly Rent (₹)</Label>
                <Input
                  id="rent"
                  type="number"
                  placeholder="8500"
                  required
                  value={formData.rent || ""}
                  onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) || 0 })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beds">Available Beds</Label>
                <Input
                  id="beds"
                  type="number"
                  placeholder="5"
                  required
                  value={formData.availableBeds || ""}
                  onChange={(e) => setFormData({ ...formData, availableBeds: parseInt(e.target.value) || 0 })}
                  className="rounded-xl h-12"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Room Types Available</Label>
              <div className="flex flex-wrap gap-4 pt-1">
                {ROOM_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2 bg-muted/50 p-2 rounded-lg border">
                    <Checkbox
                      id={type}
                      checked={formData.roomTypes.includes(type)}
                      onCheckedChange={() => setFormData({ ...formData, roomTypes: toggleSelection(formData.roomTypes, type) })}
                    />
                    <Label htmlFor={type} className="cursor-pointer text-sm font-medium">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Listing Assistant
                  </h4>
                  <p className="text-sm text-muted-foreground">Improve your description instantly using Gemini AI.</p>
                </div>
              </div>
              <AIListingEnhancer formData={formData} onApply={applyAIResult} />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  placeholder="Highlight what makes your place special..."
                  className="min-h-[150px] rounded-xl"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AMENITIES_LIST.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${item}`}
                        checked={formData.amenities.includes(item)}
                        onCheckedChange={() => setFormData({ ...formData, amenities: toggleSelection(formData.amenities, item) })}
                      />
                      <Label htmlFor={`amenity-${item}`} className="text-xs cursor-pointer">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Property Images</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={`${preview}-${index}`} className="relative aspect-square rounded-xl overflow-hidden border group">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="border-2 border-dashed border-muted flex flex-col items-center justify-center aspect-square rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">Upload</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading & Publishing...
                </>
              ) : (
                "Publish Listing"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
