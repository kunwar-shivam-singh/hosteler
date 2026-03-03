
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-6 text-center">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border max-w-md w-full space-y-6">
        <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-headline tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground font-medium">
            We encountered an unexpected error. This might be due to a temporary connection issue or a configuration mismatch.
          </p>
        </div>

        {error.message && (
          <div className="bg-muted/50 p-4 rounded-2xl border text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Error Detail</p>
            <p className="text-xs font-mono break-all text-destructive">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()} 
            className="h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
          >
            <RefreshCcw className="mr-2 h-5 w-5" /> Try Again
          </Button>
          <Button variant="outline" asChild className="h-14 rounded-2xl font-bold">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
