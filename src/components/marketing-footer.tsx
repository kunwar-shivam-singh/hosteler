
"use client";

import Link from "next/link";
import { Home, Mail, Phone, MapPin } from "lucide-react";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold font-headline text-primary uppercase">HOSTELER</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Making accommodation search simple, transparent, and affordable for students and young professionals across India.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Join as Partner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/trust-safety" className="hover:text-primary transition-colors">Trust &amp; Safety</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                support@hosteler.in
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                Mumbai, Maharashtra
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-xs text-muted-foreground font-medium">
          <p>© {currentYear} HOSTELER. All rights reserved. Built with ❤️ in India.</p>
        </div>
      </div>
    </footer>
  );
}
