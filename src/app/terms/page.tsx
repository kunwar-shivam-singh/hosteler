
"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { FileText, ShieldAlert, Gavel } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
      <main className="flex-1 bg-muted/30 pb-20">
        <section className="py-16 bg-white border-b">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline mb-4">Terms of Service</h1>
            <p className="text-muted-foreground font-medium">Last Updated: March 2025</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-[2.5rem] shadow-sm border p-8 md:p-12 space-y-10">
              <div className="space-y-4">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Gavel className="h-6 w-6 text-primary" />
                  General Terms
                </h2>
                <div className="text-muted-foreground font-medium leading-relaxed space-y-4">
                  <p>
                    hosteler.in is a marketplace platform that connects tenants and property owners. We do not own, manage, or control any PG or hostel listed on the platform.
                  </p>
                  <p>
                    By using this platform, you agree that hosteler.in acts only as an intermediary service provider.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <ShieldAlert className="h-6 w-6 text-primary" />
                  User Responsibilities
                </h2>
                <div className="text-muted-foreground font-medium leading-relaxed space-y-4">
                  <p>
                    Users are responsible for verifying property details, visiting locations, and making payments at their own discretion.
                  </p>
                  <p>
                    hosteler.in does not guarantee the accuracy of listings and is not liable for fraud, disputes, damages, losses, or transactions between users.
                  </p>
                  <p className="text-foreground font-bold">
                    We strongly advise users to visit properties personally before making any payments.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black">Platform Usage</h2>
                <div className="text-muted-foreground font-medium leading-relaxed space-y-4">
                  <p>
                    We reserve the right to suspend or terminate accounts that misuse the platform, provide false information, or engage in suspicious activity.
                  </p>
                  <p>
                    Users must ensure their contact information is accurate and that they have the right to post listings if they are property owners.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t text-sm text-muted-foreground italic">
                By signing up or using hosteler.in, you acknowledge that you have read and agreed to these terms.
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
