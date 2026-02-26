
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, PlusCircle, LayoutDashboard, LogOut, Loader2, User, CheckCircle2 } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading, userName } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading PG Locator...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const navItems = {
    tenant: [
      { label: "Find PGs", href: "/tenant/dashboard", icon: Search },
      { label: "Profile", href: "/tenant/profile", icon: User },
    ],
    owner: [
      { label: "My Listings", href: "/owner/dashboard", icon: LayoutDashboard },
      { label: "Add New", href: "/owner/add", icon: PlusCircle },
    ],
    admin: [
      { label: "Approvals", href: "/admin/dashboard", icon: CheckCircle2 },
      { label: "All Users", href: "/admin/users", icon: User },
    ],
  };

  const currentNav = role ? navItems[role] : [];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:flex h-16 items-center px-6 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center space-x-2 mr-8" href="/">
          <div className="bg-primary p-1.5 rounded-lg">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary font-headline">PG Locator</span>
        </Link>
        <nav className="flex gap-6">
          {currentNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-right">
            <p className="font-bold leading-none">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-primary">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 container mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {currentNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              pathname === item.href ? "text-primary bg-primary/5" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-accent"
        >
          <LogOut className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Logout</span>
        </button>
      </nav>
    </div>
  );
}
