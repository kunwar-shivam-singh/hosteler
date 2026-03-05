"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { Lock, Eye, Database, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
      <main className="flex-1 bg-muted/30 pb-20">
        <section className="py-16 bg-white border-b text-center">
          <div className="container mx-auto px-4">
            <div className="bg-green-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground font-medium">Your data security is our priority.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-[2.5rem] shadow-sm border p-8 md:p-12 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="bg-primary/10 p-3 rounded-2xl w-fit"><Eye className="h-6 w-6 text-primary" /></div>
                  <h2 className="text-xl font-black">Data Collected</h2>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    We collect basic information such as name, email, phone number, and listing details to provide our services effectively.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-primary/10 p-3 rounded-2xl w-fit"><Database className="h-6 w-6 text-primary" /></div>
                  <h2 className="text-xl font-black">Data Storage</h2>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Your data is stored securely using trusted cloud services (Firebase) and is never sold to third parties.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  How We Use Your Data
                </h2>
                <ul className="space-y-4 text-muted-foreground font-medium">
                  <li className="flex items-start gap-3">• To create and maintain your account profile.</li>
                  <li className="flex items-start gap-3">• To enable owners to contact interested tenants.</li>
                  <li className="flex items-start gap-3">• To improve platform functionality and user experience.</li>
                  <li className="flex items-start gap-3">• To send important account-related notifications.</li>
                </ul>
              </div>

              <div className="pt-8 border-t space-y-4">
                <h3 className="text-lg font-black">Data Removal</h3>
                <p className="text-muted-foreground font-medium">
                  You may request data removal anytime by contacting support at <strong>support@hosteler.in</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
