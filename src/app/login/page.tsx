
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect
} from "firebase/auth";
import { useFirebase } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Home, Loader2, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth } = useFirebase();
  const { user, role, isProfileComplete, loading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Monitor user state globally. If auth succeeds in background (redirect or popup), 
  // this will trigger and move the user to the next step instantly.
  useEffect(() => {
    if (!authLoading && user) {
      if (isProfileComplete && role) {
        router.replace(`/${role}/dashboard`);
      } else {
        router.replace("/complete-profile");
      }
    }
  }, [user, role, isProfileComplete, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setAuthError(error.message);
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google login error:", error);
      
      // If user is actually signed in (detected via background SDK check), ignore the error
      if (auth.currentUser) return;

      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("This domain is not authorized in Firebase Console. Please add '" + window.location.hostname + "' to Authorized Domains in Firebase Auth settings.");
        setIsGoogleLoading(false);
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Wait 2s to see if background sync caught it anyway
        setTimeout(() => {
          if (!auth.currentUser) {
            setAuthError("Sign-in window was closed. Try again or check if popups are blocked.");
            setIsGoogleLoading(false);
          }
        }, 2000);
      } else {
        setAuthError(error.message || "An error occurred during Google sign-in.");
        setIsGoogleLoading(false);
      }
    }
  };

  if (authLoading || (user && !authError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground font-headline">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] p-4 gap-6">
      <div className="w-full max-w-md flex justify-start">
        <Button variant="ghost" asChild className="rounded-xl">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl rounded-[2rem] border-none overflow-hidden bg-white">
        <CardHeader className="space-y-1 flex flex-col items-center pt-10 pb-6 bg-primary/5">
          <div className="bg-primary p-3 rounded-2xl mb-4 shadow-lg shadow-primary/20">
            <Home className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black font-headline tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-center">Sign in to your PG Locator account</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {authError && (
            <Alert variant="destructive" className="rounded-xl border-none bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="font-bold">Notice</AlertTitle>
              <AlertDescription className="text-xs">{authError}</AlertDescription>
            </Alert>
          )}

          <Button 
            variant="outline" 
            className="w-full rounded-2xl h-16 font-bold flex items-center justify-center gap-3 text-lg border-2 hover:bg-muted/50 transition-all" 
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-muted-foreground font-black tracking-widest">Or login with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold ml-1">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="h-12 rounded-xl bg-muted/30 border-none focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="password" className="font-bold ml-1">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="h-12 rounded-xl bg-muted/30 border-none focus:bg-white transition-all pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-10">
          <div className="text-sm text-center text-muted-foreground font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-black">
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
