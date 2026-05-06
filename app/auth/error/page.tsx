"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      
      <div className="glass-card max-w-md w-full p-8 relative z-10 text-center border-red-500/20">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-gray-400 mb-8">
          {error === "Configuration" && "There is a problem with the server configuration."}
          {error === "AccessDenied" && "You do not have permission to sign in."}
          {error === "Verification" && "The verification link was invalid or has expired."}
          {!error && "An unknown error occurred during authentication."}
        </p>

        <Link href="/auth/signin">
          <Button variant="outline" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animated-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ErrorContent />
    </Suspense>
  );
}
