
"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Target, 
  Heart, 
  MapPin, 
  Sparkles, 
  Zap, 
  Eye, 
  CheckCircle2, 
  Search, 
  PlusCircle, 
  Users,
  Smartphone,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <MarketingNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-7xl font-black font-headline mb-6 tracking-tight text-foreground leading-[1.1]">
              About PG Locator
            </h1>
            <p className="max-w-4xl mx-auto text-2xl md:text-3xl text-primary font-black mb-8">
              Making PG & Hostel Search Simple, Transparent, and Broker-Free
            </p>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground font-medium">
              We are building the future of urban living discovery in India, one verified listing at a time.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 border-y bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-black">Finding a home shouldn’t be a struggle.</h2>
                <p className="text-xl text-muted-foreground font-medium">But for most students and working professionals, it still is.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
                  <p>
                    Today, accommodation search often means calling multiple brokers, paying high commissions, visiting dozens of properties, and still ending up with unclear pricing or misleading photos.
                  </p>
                  <p>
                    Many PGs and hostels are not even listed online, making the process slow, confusing, and frustrating.
                  </p>
                  <p className="text-foreground font-bold">
                    PG Locator was built to change that.
                  </p>
                </div>
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                    src="https://picsum.photos/seed/about-story/800/600" 
                    fill 
                    alt="Urban search" 
                    className="object-cover"
                    data-ai-hint="urban street"
                  />
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border text-center space-y-6">
                <p className="text-xl md:text-2xl font-bold leading-relaxed">
                  We are creating a simple and transparent digital marketplace where tenants can discover verified properties and connect directly with owners.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2 font-black text-primary"><CheckCircle2 className="h-5 w-5" /> No brokers</div>
                  <div className="flex items-center gap-2 font-black text-primary"><CheckCircle2 className="h-5 w-5" /> No hidden charges</div>
                  <div className="flex items-center gap-2 font-black text-primary"><CheckCircle2 className="h-5 w-5" /> No unnecessary hassle</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl group">
                <Image 
                  src="https://picsum.photos/seed/founders-journey/800/800" 
                  fill 
                  alt="Founder journey" 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  data-ai-hint="man thinking"
                />
              </div>
              <div className="space-y-8">
                <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest">
                     <Zap className="h-3 w-3" /> Why We Built This
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black leading-tight">It started from personal experience.</h2>
                   <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-medium">
                      <p>
                        While pursuing engineering in <strong>Pune</strong>, our founder lived in multiple PGs and faced the same problems thousands of students face every year — unreliable listings, broker fees, and wasting time visiting properties that didn’t match expectations.
                      </p>
                      <p>
                        Later, after moving to <strong>Mumbai</strong> for work, the problem still existed.
                      </p>
                      <p>
                        Despite everything else going digital — taxis, food delivery, shopping — finding a simple place to stay was still stuck in the offline world.
                      </p>
                      <p className="text-primary font-black text-xl">
                        That’s when the idea for PG Locator was born. A platform that makes accommodation search as easy as booking a cab.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black">What We Do</h2>
              <p className="text-muted-foreground font-medium mt-2">Empowering both sides of the marketplace.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white">
                <CardContent className="p-12 space-y-6">
                  <div className="bg-primary text-white p-4 rounded-2xl w-fit">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-black">For Tenants</h3>
                  <ul className="space-y-4 text-muted-foreground font-medium">
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Search by area and budget</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> View real photos and amenities</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Check ratings and reviews</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Contact owners directly</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Save time and avoid brokers</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white">
                <CardContent className="p-12 space-y-6">
                  <div className="bg-orange-500 text-white p-4 rounded-2xl w-fit">
                    <PlusCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-black">For Owners</h3>
                  <ul className="space-y-4 text-muted-foreground font-medium">
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> List properties easily</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Upload photos and details</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Reach genuine tenants</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Fill rooms faster</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /> Manage everything online</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Beliefs/Values Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black">What We Believe In</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: Eye, 
                  title: "Transparency", 
                  desc: "Clear pricing, real photos, and honest information." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "Trust", 
                  desc: "Verified listings and genuine user reviews." 
                },
                { 
                  icon: Smartphone, 
                  title: "Simplicity", 
                  desc: "A smooth, mobile-friendly experience that saves time." 
                },
                { 
                  icon: Users, 
                  title: "Accessibility", 
                  desc: "Affordable housing discovery for everyone." 
                }
              ].map((value, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] border bg-white hover:border-primary transition-all group">
                  <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-primary text-white text-center">
           <div className="container mx-auto px-4 max-w-4xl space-y-8">
              <h2 className="text-3xl md:text-5xl font-black">Our Mission</h2>
              <p className="text-xl md:text-2xl font-medium leading-relaxed opacity-90">
                To organize India’s unstructured PG and hostel market and make accommodation search fast, safe, and stress-free for every student and professional.
              </p>
              <p className="font-bold opacity-70 italic">
                We are starting locally and growing city by city to help millions find better places to live.
              </p>
           </div>
        </section>

        {/* Founder Section */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                 <Card className="rounded-[3rem] border shadow-2xl overflow-hidden bg-white">
                    <CardContent className="p-12 flex flex-col md:flex-row items-center gap-12 text-left">
                       <div className="relative w-64 h-64 shrink-0 rounded-[2.5rem] overflow-hidden border-4 border-muted shadow-lg">
                          <Image 
                            src="https://picsum.photos/seed/shivam-founder/500/500" 
                            fill 
                            alt="Shivam Singh" 
                            className="object-cover" 
                          />
                       </div>
                       <div className="space-y-6">
                          <div>
                            <h3 className="text-3xl md:text-4xl font-black">Shivam Singh</h3>
                            <p className="text-primary font-bold flex items-center gap-2 mt-1">
                               Founder, PG Locator • Mumbai, Maharashtra
                            </p>
                          </div>
                          
                          <div className="relative">
                            <Sparkles className="absolute -top-6 -left-6 h-12 w-12 text-muted-foreground/20" />
                            <p className="text-xl md:text-2xl font-medium italic leading-relaxed text-muted-foreground">
                               "I started PG Locator because I personally struggled to find good PGs during my college days in Pune and later while moving to Mumbai for work. I realized that thousands of people face the same frustration every day. My goal is simple — no one should depend on brokers or waste days searching for a room. We’re building a platform that makes finding a PG quick, transparent, and reliable for everyone."
                            </p>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </section>

        {/* Join Us Section */}
        <section className="py-24 bg-muted/20 text-center">
          <div className="container mx-auto px-4 max-w-2xl space-y-8">
             <h2 className="text-3xl md:text-5xl font-black">Join Us</h2>
             <p className="text-lg text-muted-foreground font-medium">
                Whether you’re looking for a room or listing your property, PG Locator is here to make the process easier. Start exploring today and find your next home with confidence.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="h-16 px-10 rounded-2xl font-bold text-lg">
                  <Link href="/signup?role=tenant">Browse Rooms <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-2xl font-bold text-lg border-primary text-primary">
                  <Link href="/signup?role=owner">List Your Property</Link>
                </Button>
             </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
