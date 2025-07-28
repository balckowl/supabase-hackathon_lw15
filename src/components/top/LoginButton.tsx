"use client"

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";


export default function LoginButton() {

  const [isLoading, setIsLoading] = useState(false)

  const signInWithGoogle = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
      }
    })
  }

  return (
    <Button
      onClick={signInWithGoogle}
      disabled={isLoading}
      className="flex items-center gap-2 relative cursor-pointer">
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image src="/google.svg" width={16} height={16} alt="google logo" />}
      Sign in with Google
    </Button>
  );
}
