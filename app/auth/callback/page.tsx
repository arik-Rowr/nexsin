"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getAccessToken } from "@/lib/session";

export default function AuthCallback() {
  const router = useRouter();
  const calledRef = useRef(false); // 👈 duplicate calls se bachne ke liye

  useEffect(() => {
    const handleLogin = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const token = await getAccessToken();

      await fetch("https://www.nexcyn.com/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.replace("/home");
    };

    handleLogin();
  }, [router]);

  return <p>Signing you in…</p>;
}
