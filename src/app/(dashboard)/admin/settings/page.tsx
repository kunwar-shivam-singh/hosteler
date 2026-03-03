
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, ShieldCheck, Bell, Database, Save, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings Saved",
        description: "Platform configurations have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-headline">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global application parameters and moderation rules.</p>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-2xl">
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

        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-amber-50 border-b p-8">
            <div className="flex items-center gap-4">
              <div className="bg-amber-600 p-3 rounded-2xl">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure system-wide alert settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
             <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Admin Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when new listings are pending.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} className="h-14 px-10 rounded-2xl font-bold text-lg shadow-lg" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Platform Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
