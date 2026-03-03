"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, ArrowLeft, X, Home, ShieldAlert } from "lucide-react";
import Image from "next/image";

const ROOM_TYPES = ["Single Sharing", "Double Sharing", "Triple Sharing", "Four Sharing"];
const AMENITIES_LIST = ["WiFi", "Laundry", "Meals Included", "AC", "Power Backup", "CCTV", "Gym", "Parking"];

export default function EditPropertyPage() {
  const { id } = useParams();
  const { user, firestore: db } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  
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
    status: "pending"
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!db || !id) return;
      try {
        const docRef = doc(db, "properties", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Ensure ownership
          if (data.ownerId !== user?.uid) {
            router.push("/owner/dashboard");
            return;
          }
          setFormData({
            pgName: data.pgName || "",
            city: data.city || "",
            area: data.area || "",
            address: data.address || "",
            rent: data.rent || 0,
            availableBeds: data.availableBeds || 0,
            contactNumber: data.contactNumber || "",
            description: data.description || "",
            roomTypes: data.roomTypes || [],
            amenities: data.amenities || [],
            status: data.status || "pending"
          });
          setImages(data.images || []);
        } else {
          router.push("/owner/dashboard");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id, db, user, router]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages: string[] = [];
      
      for (const file of filesArray) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
        });
        newImages.push(base64);
      }
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSelection = (list: string[], item: string) => {
    return list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !id) return;

    setIsSaving(true);
    setStatusMessage("Updating listing (Requires Re-approval)...");

    try {
      const docRef = doc(db, "properties", id as string);
      
      const updateData = {
        ...formData,
        images: images,
        status: "pending", // CRITICAL: Reset to pending on ANY change
        updatedAt: new Date().toISOString(),
      };

      updateDocumentNonBlocking(docRef, updateData);

      toast({ 
        title: "Changes Saved", 
        description: "Your listing has been updated and is now pending admin re-approval." 
      });
      
      router.push("/owner/dashboard");
    } catch (error: any) {
      console.error("UPDATE ERROR:", error);
      toast({ 
        variant: "destructive", 
        title: "Update Failed", 
        description: "An error occurred while saving. Please try again." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <Button variant="ghost" className="rounded-xl" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      {formData.status === 'approved' && (
        <Card className="bg-yellow-50 border-yellow-200 text-yellow-800 rounded-2xl">
          <CardContent className="p-4 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>Notice:</strong> Saving any changes will mark your listing as <strong>Pending</strong> again. It will require administrator approval before becoming visible to tenants.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold font-headline">Manage Listing</CardTitle>
              <CardDescription>Update your PG or Hostel details</CardDescription>
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
                  required
                  value={formData.pgName}
                  onChange={(e) => setFormData({ ...formData, pgName: e.target.value })}
                  className="rounded-xl"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="rounded-xl"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="rounded-xl"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="rounded-xl"
                  disabled={isSaving}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="rounded-xl"
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                      disabled={isSaving}
                    />
                    <Label htmlFor={type} className="cursor-pointer text-xs">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Full Description</Label>
              <Textarea
                id="desc"
                className="min-h-[150px] rounded-xl"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-3">
              <Label>Amenities Available</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AMENITIES_LIST.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${item}`}
                      checked={formData.amenities.includes(item)}
                      onCheckedChange={() => setFormData({ ...formData, amenities: toggleSelection(formData.amenities, item) })}
                      disabled={isSaving}
                    />
                    <Label htmlFor={`amenity-${item}`} className="text-xs cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Property Photos</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border group">
                    <Image src={img} alt="Property" fill className="object-cover" />
                    {!isSaving && (
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
                {!isSaving && (
                  <label className="border-2 border-dashed border-muted flex flex-col items-center justify-center aspect-square rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-[10px] font-medium text-muted-foreground">Add Photo</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => router.back()} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="flex-[2] h-14 text-lg font-bold rounded-2xl" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save & Request Approval"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
