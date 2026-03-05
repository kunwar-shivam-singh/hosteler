"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, CheckCircle, PlusCircle, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
      
      <main className="flex-1">
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-7xl font-black font-headline mb-6">Simple & Seamless</h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-medium">
              Whether you are looking for a stay or managing a property, we've got you covered.
            </p>
          </div>
        </section>

        {/* Tenant Path */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16">
               <h2 className="text-3xl md:text-5xl font-black">For Tenants</h2>
               <Button asChild className="rounded-xl h-12 px-8 font-bold mt-4 md:mt-0">
                  <Link href="/signup?role=tenant">Find a Room <ArrowRight className="ml-2 h-4 w-4" /></Link>
               </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Search, 
                  title: "Smart Search", 
                  desc: "Use our advanced filters to narrow down PGs by budget, city, area, and specific amenities like WiFi, AC, or food." 
                },
                { 
                  icon: CheckCircle, 
                  title: "Verified Details", 
                  desc: "Review high-quality photos and community ratings. Every listing is cross-checked for accuracy before going live." 
                },
                { 
                  icon: Phone, 
                  title: "Contact Directly", 
                  desc: "Found a match? Call or WhatsApp the owner immediately. No middlemen, no commissions, no extra fees." 
                }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-white border shadow-sm hover:shadow-xl transition-all group">
                   <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <item.icon className="h-8 w-8" />
                   </div>
                   <h4 className="text-2xl font-black mb-4">{item.title}</h4>
                   <p className="text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Owner Path */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row items-center justify-between mb-16">
               <h2 className="text-3xl md:text-5xl font-black">For Owners</h2>
               <Button asChild variant="outline" className="rounded-xl h-12 px-8 font-bold border-primary text-primary hover:bg-primary/5 mt-4 md:mt-0">
                  <Link href="/signup?role=owner">List Your Property</Link>
               </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: PlusCircle, 
                  title: "Fast Listing", 
                  desc: "Create your property profile in under 2 minutes. Add room types, pricing, and upload photos directly from your phone." 
                },
                { 
                  icon: Sparkles, 
                  title: "AI Enhancement", 
                  desc: "Not a writer? Use Gemini AI to instantly generate professional, attractive descriptions that stand out to tenants." 
                },
                { 
                  icon: MessageSquare, 
                  title: "Instant Inquiries", 
                  desc: "Tenants contact you directly. Manage your listings and see lead statistics through your professional owner dashboard." 
                }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-white border shadow-sm hover:shadow-xl transition-all group">
                   <div className="bg-orange-100 p-5 rounded-2xl w-fit mb-6 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <item.icon className="h-8 w-8" />
                   </div>
                   <h4 className="text-2xl font-black mb-4">{item.title}</h4>
                   <p className="text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
