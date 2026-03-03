
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Heart,
  Star,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";

export default function LandingPage() {
  const db = useFirestore();
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCms() {
      if (!db) return;
      try {
        const docRef = doc(db, "siteContent", "homepage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCmsData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching CMS data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCms();
  }, [db]);

  const popularAreas = [
    { name: "Mumbai", count: "120+ Listings", img: "https://picsum.photos/seed/mumbai/400/300" },
    { name: "Bangalore", count: "85+ Listings", img: "https://picsum.photos/seed/bangalore/400/300" },
    { name: "Delhi", count: "110+ Listings", img: "https://picsum.photos/seed/delhi/400/300" },
    { name: "Pune", count: "60+ Listings", img: "https://picsum.photos/seed/pune/400/300" },
  ];

  // Default Fallbacks
  const content = {
    heroTitle: cmsData?.heroTitle || "Your Perfect Stay is Just One Tap Away",
    heroSubtitle: cmsData?.heroSubtitle || "Find verified PGs and Hostels with zero brokerage. Simple, transparent, and built for modern living.",
    tagline: cmsData?.tagline || "Now AI-Powered Listing Enhancements",
    aboutText: cmsData?.aboutText || "PG Locator helps students and professionals find verified PGs and hostels without brokers. Owners can list properties for free and connect directly with tenants.",
    features: cmsData?.features || [
      { title: "Verified Stays", desc: "Every listing is manually approved by our team to ensure safety and quality standards." },
      { title: "Community Reviews", desc: "Read honest feedback from fellow residents before you make your decision." },
      { title: "Zero Brokerage", desc: "We connect you directly with owners. No hidden fees, no middle-men commissions." }
    ]
  };

  if (loading && !cmsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary animate-bounce">
                <Sparkles className="mr-2 h-4 w-4" />
                {content.tagline}
              </div>
              <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl md:text-7xl font-headline text-foreground">
                {content.heroTitle}
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl font-medium">
                {content.heroSubtitle}
              </p>
              
              <div className="w-full max-w-2xl bg-white p-2 rounded-3xl shadow-2xl border flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search by city or area..." 
                    className="w-full h-14 pl-12 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-base font-medium"
                  />
                </div>
                <Button asChild size="lg" className="h-14 rounded-2xl px-10 font-bold text-lg">
                  <Link href="/signup?role=tenant">Browse PGs</Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  No Brokerage
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Verified Properties
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Direct Owner Contact
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">How It Works</h2>
              <p className="text-muted-foreground font-medium">Simplified experience for everyone.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                   <div className="bg-primary/10 p-2 rounded-xl text-primary"><Users className="h-6 w-6" /></div>
                   For Tenants
                </h3>
                <div className="space-y-12">
                  {[
                    { step: "01", title: "Search & Filter", desc: "Find properties in your preferred area and budget." },
                    { step: "02", title: "View Details", desc: "See real photos, amenities, and community ratings." },
                    { step: "03", title: "Direct Connect", desc: "Chat or call owners directly to book your visit." }
                  ].map((s) => (
                    <div key={s.step} className="flex gap-6 group">
                      <span className="text-4xl font-black text-primary/20 group-hover:text-primary transition-colors">{s.step}</span>
                      <div>
                        <h4 className="font-bold text-xl">{s.title}</h4>
                        <p className="text-muted-foreground font-medium">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                   <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Sparkles className="h-6 w-6" /></div>
                   For Owners
                </h3>
                <div className="space-y-12">
                  {[
                    { step: "01", title: "List Your Property", desc: "Post your PG details and photos for free in minutes." },
                    { step: "02", title: "AI Enhancements", desc: "Use Gemini AI to create professional descriptions." },
                    { step: "03", title: "Manage Leads", desc: "Get inquiries directly and manage them on your dashboard." }
                  ].map((s) => (
                    <div key={s.step} className="flex gap-6 group">
                      <span className="text-4xl font-black text-orange-600/20 group-hover:text-orange-600 transition-colors">{s.step}</span>
                      <div>
                        <h4 className="font-bold text-xl">{s.title}</h4>
                        <p className="text-muted-foreground font-medium">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Areas */}
        <section className="w-full py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-2">Popular Areas</h2>
                <p className="text-muted-foreground font-medium">Explore top localities for students and professionals.</p>
              </div>
              <Button variant="ghost" className="font-bold hidden sm:flex">View all areas <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularAreas.map((area) => (
                <Link href="/signup?role=tenant" key={area.name} className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] shadow-lg">
                  <Image 
                    src={area.img} 
                    fill 
                    alt={area.name} 
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    data-ai-hint="city view"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <h4 className="text-white text-2xl font-black">{area.name}</h4>
                    <p className="text-white/80 font-bold text-xs uppercase tracking-widest">{area.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-24 bg-white">
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="p-10 bg-primary/5 rounded-[3rem] border border-primary/10 space-y-4">
                   <div className="bg-primary text-white p-4 rounded-2xl w-fit"><ShieldCheck className="h-8 w-8" /></div>
                   <h3 className="text-2xl font-black">{content.features[0]?.title}</h3>
                   <p className="text-muted-foreground font-medium">{content.features[0]?.desc}</p>
                </div>
                <div className="p-10 bg-orange-50 rounded-[3rem] border border-orange-100 space-y-4">
                   <div className="bg-orange-500 text-white p-4 rounded-2xl w-fit"><Star className="h-8 w-8" /></div>
                   <h3 className="text-2xl font-black">{content.features[1]?.title}</h3>
                   <p className="text-muted-foreground font-medium">{content.features[1]?.desc}</p>
                </div>
                <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 space-y-4">
                   <div className="bg-blue-600 text-white p-4 rounded-2xl w-fit"><Heart className="h-8 w-8" /></div>
                   <h3 className="text-2xl font-black">{content.features[2]?.title}</h3>
                   <p className="text-muted-foreground font-medium">{content.features[2]?.desc}</p>
                </div>
             </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="w-full py-24 bg-primary text-white overflow-hidden relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">We're on a mission to simplify urban living.</h2>
              <p className="text-xl md:text-2xl font-medium opacity-90 mb-10 leading-relaxed">
                {content.aboutText}
              </p>
              <Button asChild variant="secondary" size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold">
                <Link href="/about">Read Our Story</Link>
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20"></div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
