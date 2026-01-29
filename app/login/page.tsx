"use client";

import type React from "react";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Wrench,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";
import { GoogleIcon } from "./CustomIcons";
import MuiButton from "@mui/material/Button";
import { signInWithGoogle } from "@/lib/auth";
// import { login } from "@/lib/backend";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ================================
     SUPABASE SESSION CHECK (GOOGLE)
     ================================ */
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/home");
      }
    };

    checkSession();
  }, [router]);

  /* ================================
     EMAIL / PASSWORD LOGIN
     ================================ */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // await login({ email, password });

      setSuccess("Login successful");
      router.replace("/home");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D1117]">
      <header className="border-b bg-[#0D1117]/30 border-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 sm:h-7 sm:w-7 text-[#007BFF]" />
            <span className="text-xl sm:text-2xl font-bold text-white">
              Nexcyn
            </span>
          </Link>
        </div>
      </header>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* LEFT */}
          <div className="hidden lg:block">
            <div className="bg-[#FFFFFF]/5 rounded-2xl shadow-md p-6 lg:p-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
                Welcome back to <span className="text-[#007BFF]">Nexcyn</span>
              </h1>
              <p className="text-base lg:text-lg text-[#FFFFFF] mb-6">
                Sign in to manage your bookings, track service status, and view
                your history.
              </p>
              <ul className="space-y-3">
                <li className="text-white flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-white" />
                  10,000+ happy customers
                </li>
                <li className="text-white flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-white" />
                  98% satisfaction rate
                </li>
                <li className="text-white flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-white" />
                  Same-day service in most areas
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT */}
          <Card className="bg-[#FFFFFF]/5 border-0 shadow-xl max-w-md w-full mx-auto">
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-white">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-white text-sm sm:text-base">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <form
                className="space-y-4 sm:space-y-6"
                noValidate
                onSubmit={handleLogin}
              >
                {/* EMAIL */}
                <div className="space-y-2">
                  <Label className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-11 sm:h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 h-11 sm:h-12 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 sm:h-12 rounded-xl bg-[#007BFF]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* DIVIDER */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-[#6C757D]">or</span>
                  </div>
                </div>

                {/* GOOGLE */}
                <MuiButton
                  fullWidth
                  variant="outlined"
                  disabled={isGoogleLoading}
                  startIcon={
                    isGoogleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )
                  }
                  onClick={async () => {
                    try {
                      setIsGoogleLoading(true);
                      await signInWithGoogle();
                    } catch {
                      setError("Google sign-in failed");
                      setIsGoogleLoading(false);
                    }
                  }}
                  sx={{
                    color: "#cfd4dcff",
                    fontWeight: "bold",
                    borderColor: "#3607efff",
                    backgroundColor: "#007bffda",
                    "&:hover": {
                      borderColor: "#1035f0ff",
                      backgroundColor: "#351ee3b3",
                    },
                  }}
                >
                  {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
                </MuiButton>

                <div className="text-xs sm:text-sm text-[#cbd5e1]">
                  Don&apos;t have an account?{" "}
                  <Link href="/createAccount" className="text-[#007BFF]">
                    Create account
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
