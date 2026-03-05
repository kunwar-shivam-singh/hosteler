
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { updatePassword, updateProfile } from "firebase/auth";
import { useFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, ShieldCheck, Database, Save, Loader2, Layout, MapPin, UserPlus, Lock, UserCog, Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
  const { firestore: db, auth, user } = useFirebase();
  const { toast } = useToast();
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGrantingAdmin, setIsGrantingAdmin] = useState(false);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountData, setAccountAccountData] = useState({
    name: user?.displayName || "",
    password: ""
  });

  const [cmsData, setCmsData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    tagline: "",
    aboutText: "",
    contactEmail: "support@hosteler.in",
    footerText: "© 2025 hosteler.in. All rights reserved.",
    popularAreas: [
      { name: "Mumbai", count: "120+ Listings", img: "https://picsum.photos/seed/mumbai/400/300" },
      { name: "Bangalore", count: "85+ Listings", img: "https://picsum.photos/seed/bangalore/400/300" },
      { name: "Delhi", count: "110+ Listings", img: "https://picsum.photos/seed/delhi/400/300" },
      { name: "Pune", count: "60+ Listings", img: "https://picsum.photos/seed/pune/400/300" },
    ]
  });

  useEffect(() => {
    async function fetchSettings() {
      if (!db) return;
      try {
        const docRef = doc(db, "siteContent", "homepage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCmsData({ 
            ...cmsData, 
            ...data,
            popularAreas: data.popularAreas || cmsData.popularAreas 
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [db]);

  const handleSaveCMS = async () => {
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "siteContent", "homepage"), cmsData);
      toast({ title: "CMS Updated", description: "Public homepage content has been updated." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleGrantAdmin = async () => {
    if (!db || !newAdminEmail) return;
    setIsGrantingAdmin(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", newAdminEmail));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        throw new Error("No user found with this email address.");
      }

      const targetUser = snap.docs[0];
      const targetUserId = targetUser.id;

      // 1. Update user role
      await updateDoc(doc(db, "users", targetUserId), { role: "admin" });
      
      // 2. Add to roles_admin collection for security rules
      await setDoc(doc(db, "roles_admin", targetUserId), {
        email: newAdminEmail,
        grantedAt: new Date().toISOString(),
        grantedBy: user?.email
      });

      toast({ title: "Admin Access Granted", description: `${newAdminEmail} is now an administrator.` });
      setNewAdminEmail("");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Action Failed", description: error.message });
    } finally {
      setIsGrantingAdmin(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!auth.currentUser) return;
    setIsUpdatingAccount(true);
    try {
      if (accountData.name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: accountData.name });
        await updateDoc(doc(db!, "users", auth.currentUser.uid), { name: accountData.name });
      }

      if (accountData.password) {
        await updatePassword(auth.currentUser, accountData.password);
      }

      toast({ title: "Account Updated", description: "Admin credentials changed successfully." });
      setAccountAccountData(prev => ({ ...prev, password: "" }));
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast({ variant: "destructive", title: "Security Barrier", description: "Please log out and log back in to change your password." });
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: error.message });
      }
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-10 max-w-5xl pb-32">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-black font-headline tracking-tight">Platform Controls</h1>
        <p className="text-muted-foreground font-medium">Manage administrators, homepage content, and moderation rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* CMS Editor */}
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary p-3 rounded-2xl">
                  <Layout className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Homepage CMS</CardTitle>
                  <CardDescription>Real-time marketing content editor.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input 
                    value={cmsData.heroTitle} 
                    onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
                    placeholder="Main Headline"
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle</Label>
                  <Textarea 
                    value={cmsData.heroSubtitle} 
                    onChange={(e) => setCmsData({ ...cmsData, heroSubtitle: e.target.value })}
                    placeholder="Supporting Text"
                    className="rounded-xl min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tagline Label</Label>
                    <Input value={cmsData.tagline} onChange={(e) => setCmsData({ ...cmsData, tagline: e.target.value })} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input value={cmsData.contactEmail} onChange={(e) => setCmsData({ ...cmsData, contactEmail: e.target.value })} className="rounded-xl" />
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveCMS} className="w-full h-12 rounded-xl font-bold" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Homepage Changes
              </Button>
            </CardContent>
          </Card>

          {/* Popular Areas Editor */}
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-blue-50 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Featured Cities</CardTitle>
                  <CardDescription>Manage city cards on the landing page.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cmsData.popularAreas.map((area, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border bg-muted/10 space-y-3">
                    <p className="text-[10px] font-black uppercase text-primary">Slot {idx + 1}</p>
                    <Input 
                      value={area.name} 
                      onChange={(e) => {
                        const updated = [...cmsData.popularAreas];
                        updated[idx].name = e.target.value;
                        setCmsData({ ...cmsData, popularAreas: updated });
                      }}
                      className="h-10 rounded-xl"
                      placeholder="City Name"
                    />
                    <Input 
                      value={area.count} 
                      onChange={(e) => {
                        const updated = [...cmsData.popularAreas];
                        updated[idx].count = e.target.value;
                        setCmsData({ ...cmsData, popularAreas: updated });
                      }}
                      className="h-10 rounded-xl"
                      placeholder="Count Label (e.g. 100+ Listings)"
                    />
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={handleSaveCMS} className="w-full h-12 rounded-xl font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
                Update Area Cards
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Admin Account */}
          <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-orange-50 border-b p-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-xl text-white">
                  <UserCog className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">My Account</CardTitle>
                  <CardDescription className="text-[10px]">Update admin credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Display Name</Label>
                <Input value={accountData.name} onChange={(e) => setAccountAccountData({...accountData, name: e.target.value})} className="rounded-xl h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">New Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={accountData.password} 
                    onChange={(e) => setAccountAccountData({...accountData, password: e.target.value})} 
                    className="rounded-xl h-10 pr-10"
                    placeholder="Leave blank to keep same"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button onClick={handleUpdateAccount} className="w-full rounded-xl bg-orange-600 hover:bg-orange-700" disabled={isUpdatingAccount}>
                {isUpdatingAccount ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Security Details"}
              </Button>
            </CardContent>
          </Card>

          {/* Grant Admin Access */}
          <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-purple-50 border-b p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-xl text-white">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Grant Access</CardTitle>
                  <CardDescription className="text-[10px]">Add new platform administrators</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                Enter the email of a registered user to grant them administrative privileges.
              </p>
              <Input 
                value={newAdminEmail} 
                onChange={(e) => setNewAdminEmail(e.target.value)} 
                placeholder="email@example.com"
                className="rounded-xl h-10"
              />
              <Button 
                onClick={handleGrantAdmin} 
                className="w-full rounded-xl bg-purple-600 hover:bg-purple-700" 
                disabled={isGrantingAdmin}
              >
                {isGrantingAdmin ? <Loader2 className="h-4 w-4 animate-spin" /> : "Grant Admin Access"}
              </Button>
            </CardContent>
          </Card>

          {/* Moderation Switches */}
          <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-green-50 border-b p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-xl text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold">Rules</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Auto-approve</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Identity Check</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
