
"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Target, Heart, MapPin } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="py-20 md:py-32 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-7xl font-black font-headline mb-6 tracking-tight">Our Mission</h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground font-medium">
              We aim to make accommodation search simple, transparent, and affordable for every student and professional.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <Image src="https://picsum.photos/seed/about/800/800" fill alt="Our Team" className="object-cover" />
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                   <h2 className="text-3xl md:text-5xl font-black leading-tight">Finding a home shouldn't be a struggle.</h2>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                      PG Locator was born out of a simple observation: the search for affordable housing in big cities is broken. High brokerages, unverified listings, and lack of transparency make it difficult for people to find a place they can call home.
                   </p>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                      We've built a platform that removes the middle-man, verifies every property, and leverages AI to help owners present their properties better. Whether you're a student moving for university or a professional starting a new job, we're here to help you settle in.
                   </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                   <div className="flex gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl h-fit"><Target className="h-6 w-6 text-primary" /></div>
                      <div>
                        <h4 className="font-bold">Transparency</h4>
                        <p className="text-sm text-muted-foreground">Direct pricing, real photos.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl h-fit"><ShieldCheck className="h-6 w-6 text-primary" /></div>
                      <div>
                        <h4 className="font-bold">Trust</h4>
                        <p className="text-sm text-muted-foreground">Every listing is verified.</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="py-24 bg-muted/30">
           <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-12">
                 <h2 className="text-3xl md:text-5xl font-black">Meet the Founder</h2>
                 <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden bg-white">
                    <CardContent className="p-12 flex flex-col md:flex-row items-center gap-12 text-left">
                       <div className="relative w-48 h-48 shrink-0 rounded-full overflow-hidden border-8 border-primary/10">
                          <Image src="https://picsum.photos/seed/founder/300/300" fill alt="Founder" className="object-cover" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-3xl font-black">Shivam Singh</h3>
                          <p className="text-primary font-bold flex items-center gap-2">
                             <MapPin className="h-4 w-4" /> Mumbai, Maharashtra
                          </p>
                          <p className="text-lg text-muted-foreground italic leading-relaxed">
                             "I started PG Locator because I was tired of the hassle I faced while looking for a room in Mumbai. My goal is to ensure no one else has to go through that frustration. We are building the future of urban living, one verified room at a time."
                          </p>
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
