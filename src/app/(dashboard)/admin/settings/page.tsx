
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, ShieldCheck, Bell, Database, Save, Loader2, Sparkles, Layout } from "lucide-react";

export default function AdminSettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cmsData, setCmsData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    tagline: "",
    aboutText: "",
    contactEmail: "support@pglocator.com",
    footerText: "© 2025 PG Locator. All rights reserved.",
  });

  useEffect(() => {
    async function fetchSettings() {
      if (!db) return;
      try {
        const docRef = doc(db, "siteContent", "homepage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCmsData({ ...cmsData, ...docSnap.data() });
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
      toast({
        title: "CMS Updated",
        description: "Public homepage content has been updated successfully.",
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-headline">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global application parameters and moderation rules.</p>
      </div>

      <div className="grid gap-8">
        {/* CMS Editor */}
        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-2xl">
                <Layout className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Homepage CMS</CardTitle>
                <CardDescription>Edit public marketing content in real-time.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input 
                  value={cmsData.heroTitle} 
                  onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
                  placeholder="The main headline"
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea 
                  value={cmsData.heroSubtitle} 
                  onChange={(e) => setCmsData({ ...cmsData, heroSubtitle: e.target.value })}
                  placeholder="Supporting text below headline"
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label>Top Tagline</Label>
                    <Input 
                      value={cmsData.tagline} 
                      onChange={(e) => setCmsData({ ...cmsData, tagline: e.target.value })}
                      className="rounded-xl h-12"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input 
                      value={cmsData.contactEmail} 
                      onChange={(e) => setCmsData({ ...cmsData, contactEmail: e.target.value })}
                      className="rounded-xl h-12"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                <Label>About Mission Text</Label>
                <Textarea 
                  value={cmsData.aboutText} 
                  onChange={(e) => setCmsData({ ...cmsData, aboutText: e.target.value })}
                  placeholder="Describe your mission"
                  className="rounded-xl min-h-[120px]"
                />
              </div>
            </div>
            <Button onClick={handleSaveCMS} className="w-full h-12 rounded-xl font-bold" disabled={saving}>
               {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
               Save CMS Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-orange-50 border-b p-8">
            <div className="flex items-center gap-4">
              <div className="bg-orange-600 p-3 rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Moderation Rules</CardTitle>
                <CardDescription>Control how listings are processed.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-approve Listings</Label>
                <p className="text-sm text-muted-foreground">New listings will be visible immediately without review.</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Identity Verification</Label>
                <p className="text-sm text-muted-foreground">Require owners to verify phone numbers before listing.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-blue-50 border-b p-8">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Platform Limits</CardTitle>
                <CardDescription>Set global constraints for data.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Maximum Photos per Listing</Label>
                <Input type="number" defaultValue={10} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label>Minimum Monthly Rent (₹)</Label>
                <Input type="number" defaultValue={1000} className="rounded-xl h-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
