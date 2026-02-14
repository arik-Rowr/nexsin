"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Step 1 → Send OTP (UI only)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1000);
  };

  // Step 2 → Verify OTP (No checking)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);

    setTimeout(() => {
      router.push("/password/reset");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative">
      <form
        onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp}
        className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl"
      >
        <h1 className="text-white text-2xl mb-2 font-semibold">
          Forgot Password
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          {step === "email"
            ? "Enter your registered email address."
            : `Enter the 6-digit OTP sent to ${email}`}
        </p>

        {step === "email" && (
          <>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl bg-white/10 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl text-white flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              required
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full p-3 rounded-xl bg-white/10 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none tracking-widest text-center text-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl text-white">
              Verify OTP
            </button>
          </>
        )}
      </form>

      {/* Professional Success Modal */}
      {success && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-green-500/30 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl animate-scaleIn">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              OTP Verified Successfully
            </h2>
            <p className="text-gray-400 text-sm">
              Redirecting to reset password...
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-in-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
