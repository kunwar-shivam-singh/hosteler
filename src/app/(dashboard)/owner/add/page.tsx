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
import { Loader2, Upload, ArrowLeft, X, Home, Sparkles, AlertCircle } from "lucide-react";
import Image from "next/image";
import { AIListingEnhancer } from "@/components/ai-listing-enhancer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ROOM_TYPES = ["Single Sharing", "Double Sharing", "Triple Sharing", "Four Sharing"];
const AMENITIES_LIST = ["WiFi", "Laundry", "Meals Included", "AC", "Power Backup", "CCTV", "Gym", "Parking"];

export default function AddPropertyPage() {
  const { user, firestore: db, storage } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
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

  const uploadWithTimeout = async (imageRef: any, file: File, timeoutMs = 30000) => {
    return Promise.race([
      uploadBytes(imageRef, file),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Upload timed out. Please ensure Firebase Storage is enabled in your console and the bucket is initialized.")), timeoutMs)
      )
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ variant: "destructive", title: "Auth Required", description: "You must be logged in to post." });
      return;
    }

    if (images.length === 0) {
      toast({ variant: "destructive", title: "Images Required", description: "Please upload at least one image of the property." });
      return;
    }

    setIsLoading(true);
    setUploadProgress("Preparing to upload...");

    try {
      const imageUrls: string[] = [];
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        setUploadProgress(`Uploading photo ${i + 1} of ${images.length}...`);
        
        const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const imagePath = `properties/${user.uid}/${fileName}`;
        const imageRef = ref(storage, imagePath);
        
        try {
          const uploadResult: any = await uploadWithTimeout(imageRef, image);
          const url = await getDownloadURL(uploadResult.ref);
          imageUrls.push(url);
        } catch (uploadErr: any) {
          console.error("UPLOAD ERROR:", uploadErr);
          throw new Error(uploadErr.message || `Failed to upload photo ${i + 1}`);
        }
      }

      setUploadProgress("Saving property details...");
      const propertiesRef = collection(db, "properties");
      
      // Explicitly construct final data to ensure no unwanted amenities are added
      const propertyData = {
        pgName: formData.pgName,
        city: formData.city,
        area: formData.area,
        address: formData.address,
        rent: formData.rent,
        availableBeds: formData.availableBeds,
        contactNumber: formData.contactNumber,
        description: formData.description,
        roomTypes: formData.roomTypes,
        amenities: formData.amenities, // Only includes what user checked
        ownerId: user.uid,
        images: imageUrls,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      addDocumentNonBlocking(propertiesRef, propertyData);

      toast({ 
        title: "Listing Submitted!", 
        description: "Your PG is now pending approval by an administrator." 
      });
      
      router.push("/owner/dashboard");
    } catch (error: any) {
      console.error("SUBMISSION ERROR:", error);
      toast({ 
        variant: "destructive", 
        title: "Submission Failed", 
        description: error.message || "An unexpected error occurred during publishing." 
      });
      setIsLoading(false);
      setUploadProgress("");
    }
  };

  const applyAIResult = (description: string) => {
    setFormData((prev) => ({
      ...prev,
      description
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <Button variant="ghost" className="rounded-xl" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {isLoading && (
        <Alert className="bg-primary/10 border-primary/20 text-primary animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Publishing in progress</AlertTitle>
          <AlertDescription>{uploadProgress}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold font-headline">New Listing</CardTitle>
              <CardDescription>Enter details for your PG or Hostel</CardDescription>
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
                  placeholder="e.g. Royal Stay PG"
                  required
                  value={formData.pgName}
                  onChange={(e) => setFormData({ ...formData, pgName: e.target.value })}
                  className="rounded-xl"
                  disabled={isLoading}
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
                  className="rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g. Bangalore"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  placeholder="e.g. HSR Layout"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="Building name, street, landmark"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rent">Monthly Rent (₹)</Label>
                <Input
                  id="rent"
                  type="number"
                  required
                  value={formData.rent || ""}
                  onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) || 0 })}
                  className="rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beds">Available Beds</Label>
                <Input
                  id="beds"
                  type="number"
                  required
                  value={formData.availableBeds || ""}
                  onChange={(e) => setFormData({ ...formData, availableBeds: parseInt(e.target.value) || 0 })}
                  className="rounded-xl"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Room Sharing Options</Label>
              <div className="flex flex-wrap gap-3">
                {ROOM_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2 bg-muted/50 p-2 rounded-lg border">
                    <Checkbox
                      id={type}
                      checked={formData.roomTypes.includes(type)}
                      onCheckedChange={() => setFormData({ ...formData, roomTypes: toggleSelection(formData.roomTypes, type) })}
                      disabled={isLoading}
                    />
                    <Label htmlFor={type} className="cursor-pointer text-xs">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Description Enhancer
                  </h4>
                  <p className="text-sm text-muted-foreground">Get a professional description instantly. Amenities are not auto-modified.</p>
                </div>
              </div>
              <AIListingEnhancer formData={formData} onApply={applyAIResult} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Full Description</Label>
              <Textarea
                id="desc"
                placeholder="Details about meals, rules, facilities..."
                className="min-h-[150px] rounded-xl"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <Label>Amenities Available (Manual Selection)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AMENITIES_LIST.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${item}`}
                      checked={formData.amenities.includes(item)}
                      onCheckedChange={() => setFormData({ ...formData, amenities: toggleSelection(formData.amenities, item) })}
                      disabled={isLoading}
                    />
                    <Label htmlFor={`amenity-${item}`} className="text-xs cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Property Photos (At least one is required)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={`${preview}-${index}`} className="relative aspect-square rounded-xl overflow-hidden border group">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    {!isLoading && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                {!isLoading && (
                  <label className="border-2 border-dashed border-muted flex flex-col items-center justify-center aspect-square rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-[10px] font-medium text-muted-foreground">Add Photo</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {isLoading && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-bold">Important Notice</p>
                  <p>If this stays on "Publishing" for more than 30 seconds, please ensure you have clicked <strong>"Get Started"</strong> in the Storage section of your Firebase Console.</p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publishing Listing...
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
