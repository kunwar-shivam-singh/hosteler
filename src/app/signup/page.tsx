
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Home, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, role, isProfileComplete, loading: authLoading } = useAuth();
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (isProfileComplete && role) {
        router.push(`/${role}/dashboard`);
      } else {
        router.push("/complete-profile");
      }
    }
  }, [user, role, isProfileComplete, authLoading, router]);

  // Handle redirect result for mobile users returning from Google
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setIsGoogleLoading(true);
          const firebaseUser = result.user;
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            router.push(`/${userData.role}/dashboard`);
            toast({ title: "Welcome back", description: `Logged in as ${userData.name}` });
          } else {
            router.push("/complete-profile");
          }
        }
      } catch (error: any) {
        console.error("Auth redirect error:", error);
        if (error.code !== 'auth/popup-closed-by-user') {
          toast({ variant: "destructive", title: "Signup Failed", description: "Authentication failed. Please try again." });
        }
      } finally {
        setIsGoogleLoading(false);
      }
    };
    handleRedirect();
  }, [router, toast]);

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    
    // Use Redirection for mobile browsers to avoid popup issues
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;

        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          router.push(`/${userData.role}/dashboard`);
          toast({ title: "Welcome back", description: `Logged in as ${userData.name}` });
        } else {
          router.push("/complete-profile");
        }
      }
    } catch (error: any) {
      console.error("Google signup error:", error);
      // Fallback to redirect if popup is blocked or closed
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          toast({ variant: "destructive", title: "Signup Failed", description: redirectError.message });
          setIsGoogleLoading(false);
        }
      } else {
        toast({ variant: "destructive", title: "Signup Failed", description: error.message });
        setIsGoogleLoading(false);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 gap-6">
      <div className="w-full max-w-md flex justify-start">
        <Button variant="ghost" asChild className="rounded-xl">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-xl rounded-[2.5rem] border-none overflow-hidden">
        <CardHeader className="space-y-1 flex flex-col items-center pt-10 pb-6 bg-primary/5">
          <div className="bg-primary p-3 rounded-2xl mb-4 shadow-lg shadow-primary/20">
            <Home className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black font-headline tracking-tight">Join PG Locator</CardTitle>
          <CardDescription className="text-center px-6">The fastest way to find or list your perfect stay.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <Button 
            variant="outline" 
            className="w-full rounded-2xl h-16 font-bold flex items-center justify-center gap-3 text-lg border-2 hover:bg-muted/50 transition-all" 
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          <p className="text-center text-xs text-muted-foreground font-medium px-4">
            By continuing, you agree to our terms and will be prompted to complete your profile in the next step.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-10">
          <div className="text-sm text-center text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-black">
              Sign in here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
