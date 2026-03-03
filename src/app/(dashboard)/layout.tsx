
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Search, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut, 
  Loader2, 
  User, 
  CheckCircle2,
  Users,
  Settings,
  Bell,
  Star,
  MessageSquare
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading, userName } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role) {
        // Enforce role-based routing to prevent cross-role access and permission errors
        const segments = pathname.split('/');
        const roleInPath = segments[1]; // 'admin', 'tenant', 'owner'
        
        // Only validate if we are in a role-prefixed route
        if (['admin', 'tenant', 'owner'].includes(roleInPath) && roleInPath !== role) {
          console.warn(`Redirecting unauthorized access: ${role} tried to access ${roleInPath}`);
          router.push(`/${role}/dashboard`);
        }
      }
    }
  }, [user, role, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading PG Locator...</p>
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
      { label: "Explorer", href: "/tenant/dashboard", icon: Search },
      { label: "Profile", href: "/tenant/profile", icon: User },
    ],
    owner: [
      { label: "Insights", href: "/owner/dashboard", icon: LayoutDashboard },
      { label: "Add PG", href: "/owner/add", icon: PlusCircle },
      { label: "Reviews", href: "/owner/reviews", icon: Star },
      { label: "Profile", href: "/owner/profile", icon: User },
    ],
    admin: [
      { label: "Approvals", href: "/admin/dashboard", icon: CheckCircle2 },
      { label: "Review Ops", href: "/admin/reviews", icon: Star },
      { label: "User Ops", href: "/admin/users", icon: Users },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  };

  const currentNav = role ? navItems[role as keyof typeof navItems] : [];
  const dashboardHome = role ? `/${role}/dashboard` : "/";

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-white border-r">
        <div className="p-8">
          <Link className="flex items-center space-x-3" href={dashboardHome}>
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary font-headline tracking-tight">PG Locator</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4">Main Menu</p>
          {currentNav.map((item: any) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t">
          <div className="bg-muted/30 p-4 rounded-[1.5rem] flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-primary text-white font-bold">
                {userName?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate leading-none mb-1">{userName || "User"}</p>
              <p className="text-[10px] text-muted-foreground capitalize font-medium">{role}</p>
            </div>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:ml-72 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b">
          <h2 className="text-xl font-bold font-headline capitalize">
            {pathname.split('/').pop()?.replace('-', ' ') || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-8 w-[1px] bg-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold leading-none">{userName}</p>
                <p className="text-[10px] text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden flex h-16 items-center justify-between px-6 bg-white border-b sticky top-0 z-40">
          <Link className="flex items-center space-x-2" href={dashboardHome}>
            <div className="bg-primary p-1.5 rounded-lg">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-primary">PG Locator</span>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t flex justify-around items-center h-20 px-4 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        {currentNav.slice(0, 4).map((item: any) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1.5 min-w-[64px] transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${isActive ? "bg-primary/10" : ""}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1.5 min-w-[64px] text-muted-foreground"
        >
          <div className="p-2">
            <LogOut className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tight">Logout</span>
        </button>
      </nav>
    </div>
  );
}
