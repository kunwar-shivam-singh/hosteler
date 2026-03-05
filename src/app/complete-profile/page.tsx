
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCheck, Smartphone, MapPin } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, isProfileComplete, loading: authLoading, role: currentRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: "tenant" as "tenant" | "owner",
    phone: "",
    city: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (!authLoading && isProfileComplete && currentRole) {
      // Profile already done, go to dashboard
      router.push(`/${currentRole}/dashboard`);
    }
  }, [user, isProfileComplete, authLoading, router, currentRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName || "User",
        email: user.email,
        phone: formData.phone,
        city: formData.city,
        role: formData.role,
        createdAt: new Date().toISOString(),
        termsAcceptedAt: new Date().toISOString(),
      });

      toast({ title: "Profile Completed!", description: "Welcome to the platform." });
      
      // Use window.location.href for a hard redirect to ensure AuthContext 
      // fetches the updated user document immediately on reload.
      window.location.href = `/${formData.role}/dashboard`;
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border-none overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-8 text-center">
          <div className="bg-primary p-3 rounded-2xl w-fit mx-auto mb-4">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-black font-headline">Almost there!</CardTitle>
          <CardDescription>Just a few more details to set up your account</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">I am a...</Label>
              <RadioGroup
                defaultValue={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val as any })}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="tenant" id="r-tenant" className="peer sr-only" />
                  <Label
                    htmlFor="r-tenant"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <span className="text-sm font-bold">Tenant</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="owner" id="r-owner" className="peer sr-only" />
                  <Label
                    htmlFor="r-owner"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <span className="text-sm font-bold">Owner</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  required
                  className="pl-10 h-12 rounded-xl"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Current City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder="e.g. Mumbai"
                  required
                  className="pl-10 h-12 rounded-xl"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  suppressHydrationWarning
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
