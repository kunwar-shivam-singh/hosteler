
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCheck, Smartphone, MapPin, ShieldCheck, Info } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, isProfileComplete, loading: authLoading, role: currentRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    role: "tenant" as "tenant" | "owner",
    phone: "",
    city: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (!authLoading && isProfileComplete && currentRole) {
      router.push(`/${currentRole}/dashboard`);
    }
  }, [user, isProfileComplete, authLoading, router, currentRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!agreed) {
      toast({ variant: "destructive", title: "Agreement Required", description: "You must agree to the terms to continue." });
      return;
    }

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
        status: "active",
        createdAt: new Date().toISOString(),
        termsAcceptedAt: new Date().toISOString(),
      });

      toast({ title: "Profile Completed!", description: "Welcome to PG Locator." });
      
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] p-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-[2.5rem] border-none overflow-hidden bg-white">
        <CardHeader className="bg-primary/5 border-b p-10 text-center">
          <div className="bg-primary p-4 rounded-[1.5rem] w-fit mx-auto mb-6 shadow-lg shadow-primary/20">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black font-headline tracking-tight">Complete your profile</CardTitle>
          <CardDescription className="text-base font-medium">Just a few more details to get you started</CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Account Type</Label>
              <RadioGroup
                defaultValue={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val as any })}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="tenant" id="r-tenant" className="peer sr-only" />
                  <Label
                    htmlFor="r-tenant"
                    className="flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-muted bg-white hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <span className="text-lg font-black">Tenant</span>
                    <span className="text-[10px] text-muted-foreground font-bold">Looking for a PG</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="owner" id="r-owner" className="peer sr-only" />
                  <Label
                    htmlFor="r-owner"
                    className="flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-muted bg-white hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <span className="text-lg font-black">Owner</span>
                    <span className="text-[10px] text-muted-foreground font-bold">Listing a Property</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold ml-1">Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    required
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus:bg-white transition-all font-medium"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-bold ml-1">Current City</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    id="city"
                    placeholder="e.g. Mumbai"
                    required
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus:bg-white transition-all font-medium"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                <strong>Note:</strong> You can set an account password in your Profile section after setup to login with your email directly in the future.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-2xl border-dashed border-2">
                <Checkbox 
                  id="terms" 
                  checked={agreed} 
                  onCheckedChange={(val) => setAgreed(!!val)} 
                  className="mt-1 h-5 w-5 rounded-lg"
                />
                <Label htmlFor="terms" className="text-xs leading-relaxed font-bold text-muted-foreground cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>,{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{" "}
                  <Link href="/trust-safety" className="text-primary hover:underline">Trust & Safety</Link> guidelines.
                </Label>
              </div>

              <Button type="submit" className="w-full h-16 rounded-[1.5rem] font-black text-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading || !agreed}>
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : "Complete Setup"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
