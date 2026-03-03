
"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
      
      <main className="flex-1">
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-7xl font-black font-headline mb-6">Get in touch</h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-medium">
              Have questions? We are here to help you find your perfect stay or manage your listing.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex gap-6 items-center bg-white p-8 rounded-[2rem] border shadow-sm">
                    <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0"><Mail className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-lg">Email Support</p>
                      <p className="text-muted-foreground">support@pglocator.com</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center bg-white p-8 rounded-[2rem] border shadow-sm">
                    <div className="bg-green-100 p-4 rounded-2xl text-green-600 shrink-0"><MessageCircle className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-lg">WhatsApp Support</p>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-6 items-center bg-white p-8 rounded-[2rem] border shadow-sm">
                    <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 shrink-0"><MapPin className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-lg">Visit Us</p>
                      <p className="text-muted-foreground">Andheri East, Mumbai, Maharashtra</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center bg-white p-8 rounded-[2rem] border shadow-sm">
                    <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 shrink-0"><Phone className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-lg">Call Us</p>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-20 text-center space-y-4">
                <h2 className="text-2xl font-bold">Operating Hours</h2>
                <p className="text-muted-foreground font-medium">
                  Our support team is available Monday through Saturday, 9 AM to 7 PM.
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
