"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { ShieldAlert, CheckCircle2, AlertTriangle, UserCheck, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TrustSafetyPage() {
  const guidelines = [
    {
      title: "Always visit the property before paying",
      desc: "Never make a booking or deposit based solely on online photos. Visit the location to check the room, building, and surrounding area.",
      icon: Search
    },
    {
      title: "Never transfer money without verification",
      desc: "Be cautious of anyone asking for advance payments before you've seen the property. Fraudsters often use high-pressure tactics.",
      icon: AlertTriangle
    },
    {
      title: "Meet the owner personally",
      desc: "Interact with the property owner or manager directly at the PG location to confirm their identity and authority.",
      icon: UserCheck
    },
    {
      title: "Report fake listings immediately",
      desc: "Help the community by reporting any suspicious listings, inaccurate photos, or fraudulent behavior to our support team.",
      icon: ShieldAlert
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
      <main className="flex-1 bg-muted/30 pb-20">
        <section className="py-20 bg-white border-b">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-orange-100 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-headline mb-4">Trust & Safety</h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-medium">
              Your safety is our priority. Follow these guidelines for a secure experience.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Alert className="bg-orange-50 border-orange-200 text-orange-800 rounded-[2rem] p-8 mb-12 shadow-sm">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <AlertTitle className="text-xl font-black mb-2 ml-4">Warning Banner</AlertTitle>
              <AlertDescription className="text-lg font-medium ml-4">
                HOSTELER never asks for payments or deposits. Always visit and verify before paying any owner.
              </AlertDescription>
            </Alert>

            <div className="space-y-8">
              <h2 className="text-3xl font-black text-center mb-12">Safety Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {guidelines.map((g, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-primary transition-all">
                    <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <g.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-black mb-3">{g.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 bg-white p-12 rounded-[3rem] border shadow-sm text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black mb-4">Verified Listings</h3>
              <p className="text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                We manually review listings to ensure high quality and accuracy, but we rely on you to perform your own due diligence before making any commitments or payments.
              </p>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
