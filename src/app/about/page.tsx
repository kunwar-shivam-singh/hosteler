
"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Target, Heart, MapPin, Sparkles, Zap, Eye } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <MarketingNavbar />
      
      <main className="flex-1">
        {/* Header / Mission Section */}
        <section className="py-20 md:py-32 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-7xl font-black font-headline mb-8 tracking-tight text-foreground">Our Mission</h1>
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
              We aim to make accommodation search simple, transparent, and affordable for every student and working professional.
            </p>
            <div className="mt-12 max-w-2xl mx-auto p-8 bg-white rounded-[2rem] shadow-sm border border-primary/10">
               <p className="text-lg text-muted-foreground font-medium italic">
                "Finding a safe and comfortable place to stay in a new city shouldn’t involve brokers, hidden costs, or endless street visits. Our mission is to organize the unstructured PG and hostel market and make discovery fast, reliable, and completely digital."
               </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl group">
                <Image 
                  src="https://picsum.photos/seed/story/800/800" 
                  fill 
                  alt="Our Story" 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  data-ai-hint="office startup"
                />
              </div>
              <div className="space-y-8">
                <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                     <Zap className="h-3 w-3" /> Our Story
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black leading-tight">Finding a home shouldn’t be a struggle.</h2>
                   <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-medium">
                      <p>
                        PG Locator was born from real-life experience.
                      </p>
                      <p>
                        While studying in <strong>Pune</strong>, I lived in multiple PGs and hostels and faced the same problems most students face — unverified listings, broker fees, misleading photos, and wasting hours visiting properties that didn’t match expectations.
                      </p>
                      <p>
                        Even after moving to <strong>Mumbai</strong> for work, the problem remained the same. Despite everything else going digital, PG and hostel search was still offline, confusing, and dependent on middlemen.
                      </p>
                      <p>
                        That’s when PG Locator was created — to simplify the process for everyone. We built a platform where tenants can discover verified properties with real photos, transparent pricing, amenities, and reviews — and connect directly with owners without brokers.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Stand For */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black">What We Stand For</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Eye, 
                  title: "Transparency", 
                  desc: "Clear pricing. Real photos. No surprises." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "Trust", 
                  desc: "Verified listings and genuine reviews." 
                },
                { 
                  icon: Zap, 
                  title: "Simplicity", 
                  desc: "Search, compare, and contact owners in minutes." 
                }
              ].map((value, i) => (
                <Card key={i} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white">
                  <CardContent className="p-10 text-center space-y-4">
                    <div className="bg-primary/10 p-5 rounded-3xl w-fit mx-auto text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black">{value.title}</h3>
                    <p className="text-muted-foreground font-medium">{value.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                 <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-primary text-white">
                    <CardContent className="p-12 flex flex-col md:flex-row items-center gap-12 text-left">
                       <div className="relative w-56 h-56 shrink-0 rounded-[2rem] overflow-hidden border-8 border-white/20 shadow-lg">
                          <Image 
                            src="https://picsum.photos/seed/founder/400/400" 
                            fill 
                            alt="Shivam Singh" 
                            className="object-cover" 
                          />
                       </div>
                       <div className="space-y-6">
                          <div>
                            <h3 className="text-3xl md:text-4xl font-black">Shivam Singh</h3>
                            <p className="text-white/80 font-bold flex items-center gap-2 mt-1">
                               Founder, PG Locator • Mumbai, Maharashtra
                            </p>
                          </div>
                          
                          <div className="relative">
                            <Sparkles className="absolute -top-6 -left-6 h-12 w-12 text-white/10" />
                            <p className="text-xl md:text-2xl font-medium italic leading-relaxed text-white/90">
                               "I built PG Locator after personally struggling to find good PGs during my college days in Pune and later while moving to Mumbai for work. I realized thousands of students and professionals face the same frustration every day. My goal is simple — make finding a PG as easy as booking a cab or ordering food. No brokers. No stress. Just the right place to stay."
                            </p>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
