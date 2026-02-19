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

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  Phone,
} from "lucide-react";


export default function LoginPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"user" | "pro">("user");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.replace("/home");
    };
    checkSession();
  }, [router]);


  /* 
     SUPABASE SESSION CHECK (GOOGLE)
  */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  /* 
     EMAIL / PASSWORD LOGIN*/

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((res) => setTimeout(res, 1200));
      router.replace(activeTab === "pro" ? "/providerdashboard" : "/home");
    } catch {
      setError("Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0B1426] flex items-center justify-center px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[700px] h-[700px] bg-gradient-to-r from-blue-600/20 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center space-y-4">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Reliable Home Services <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Delivered On Time
              </span>
            </h1>

            <p className="mt-5 text-gray-400 text-lg">
              Connect with trusted professionals, manage bookings easily,
              and track your services in real time — all in one secure platform.
            </p>
          </div>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              Verified service professionals
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
              Real-time booking & tracking
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
              Secure & seamless experience
            </div>
          </div>

          <div className="relative pt-6">
            <img
              src="/login-illustration.png"
              alt="Service Platform Illustration"
              className="relative w-[300px] xl:w-[500px] max-w-full opacity-95"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl w-full max-w-md mx-auto">
          <CardHeader className="space-y-6 p-6">
            {/* Toggle */}
            <div className="relative flex bg-[#0B1426] p-1 rounded-full overflow-hidden">
              <span
                className={`absolute top-1 bottom-1 w-1/2 rounded-full transition-all duration-300 ${
                  activeTab === "user"
                    ? "left-1 bg-[#007BFF]"
                    : "left-[50%] bg-gradient-to-r from-blue-600 to-indigo-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setActiveTab("user")}
                className="relative z-10 w-1/2 py-2 text-sm font-medium text-white"
              >
                User Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pro")}
                className="relative z-10 w-1/2 py-2 text-sm font-medium text-white"
              >
                Professional Login
              </button>
            </div>

            <div className="space-y-2">
              {activeTab === "pro" && (
                <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-blue-600/20 text-purple-400 border border-purple-500/30">
                  <ShieldCheck size={14} />
                  Service Provider Access
                </div>
              )}

              <CardTitle className="text-2xl text-white">
                {activeTab === "user"
                  ? "Welcome Back"
                  : "Professional Dashboard Login"}
              </CardTitle>

              <CardDescription className="text-gray-400">
                {activeTab === "user"
                  ? "Sign in to manage your bookings"
                  : "Login to manage your services & clients"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email / Mobile */}
              <div className="space-y-2">
                <Label className="text-gray-300">
                  Email or Mobile Number
                </Label>
                <div className="relative">
                  {identifier.includes("@") ? (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  )}
                  <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-9 h-12 rounded-xl bg-[#0B1426] border-[#1F2A44] text-white"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-12 rounded-xl bg-[#0B1426] border-[#1F2A44] text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* 🔥 Forgot Password Link Added */}
              <div className="flex justify-end -mt-2">
                <Link
                  href="/password/forget"
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-12 rounded-xl flex items-center justify-center ${
                  activeTab === "user"
                    ? "bg-[#007BFF] hover:bg-blue-600"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : activeTab === "user" ? (
                  "Sign In"
                ) : (
                  "Access Dashboard"
                )}
              </Button>

              {/* Register Links */}
              <div className="text-sm text-gray-400 text-center mt-4">
                {activeTab === "user" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/CreateAccount"
                      className="text-[#007BFF] hover:underline"
                    >
                      Create user account
                    </Link>
                  </>
                ) : (
                  <>
                    Want to join as a professional?{" "}
                    <Link
                      href="/serviceproviderauthentication/register"
                      className="text-purple-400 hover:underline"
                    >
                      Register as Service Provider
                    </Link>
                  </>
                )}
              </div>

              {/* Legal Notice */}
              <p className="text-xs text-gray-500 text-center mt-6">
                By continuing, you agree to our{" "}
                <Link
                  href="/legal/terms"
                  className="text-blue-400 hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/legal/privacy"
                  className="text-blue-400 hover:underline"
                >
                  Privacy Policy
                </Link>.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
