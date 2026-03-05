
"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Home, Menu, X, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";

export function MarketingNavbar() {
  const { user, role, loading, userName } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold font-headline text-primary tracking-tight">hosteler.in</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!loading && user && role ? (
              <Button asChild className="rounded-full px-6 flex items-center gap-2">
                <Link href={`/${role}/dashboard`}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="truncate max-w-[120px]">Hi, {userName?.split(' ')[0] || 'User'}</span>
                </Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
                <Button asChild className="rounded-full px-6">
                  <Link href="/signup?role=owner">List PG</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white px-2 pb-3 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t pt-4 pb-2 px-3 flex flex-col gap-3">
             {!loading && user && role ? (
                <Button asChild className="w-full">
                  <Link href={`/${role}/dashboard`}>
                    Go to Dashboard ({userName?.split(' ')[0]})
                  </Link>
                </Button>
             ) : (
               <>
                 <Link href="/login" className="text-center font-bold text-muted-foreground py-2">Login</Link>
                 <Button asChild className="w-full">
                    <Link href="/signup?role=owner">List Your PG</Link>
                 </Button>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
