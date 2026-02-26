"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Home, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="bg-primary p-1.5 rounded-lg">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold font-headline text-primary">PG Locator</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline text-foreground">
                  Your Perfect Stay is Just <span className="text-primary italic">One Tap</span> Away
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover affordable, comfortable, and verified PGs and Hostels. Mobile-first experience for modern tenants and owners.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full px-8 py-6 h-auto text-lg">
                  <Link href="/signup?role=tenant">
                    Find a Room <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 h-auto text-lg">
                  <Link href="/signup?role=owner">List Your Property</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-2 p-6 rounded-2xl bg-background/50 border border-border/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Easy Search</h3>
                <p className="text-center text-muted-foreground">Filter by city, rent, and amenities to find exactly what you need in seconds.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-2xl bg-background/50 border border-border/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Verified Only</h3>
                <p className="text-center text-muted-foreground">Every listing is manually approved by our admins to ensure safety and quality.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-2xl bg-background/50 border border-border/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <Image src="https://picsum.photos/seed/ai/64/64" alt="AI" width={32} height={32} className="rounded" />
                </div>
                <h3 className="text-xl font-bold font-headline">AI Enhanced</h3>
                <p className="text-center text-muted-foreground">Owners can use Gemini AI to generate professional property descriptions instantly.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 px-4 border-t bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear || '...'} PG Locator. All rights reserved. Built for mobile.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">Terms</Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
