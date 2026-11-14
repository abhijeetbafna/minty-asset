"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient();

    const handleCallback = async () => {
      // Exchange session if token or code is in hash/URL
      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session) {
        router.push("/dashboard");
      } else {
        // Listen for auth state change after OAuth redirect
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session) {
              router.push("/dashboard");
            }
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Completing sign in, redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
