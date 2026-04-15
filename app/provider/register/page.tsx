"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const sendOtp = async () => {
    if (!agree) {
      alert("Please agree to Terms & Conditions");
      return;
    }

    if (phone.length !== 10) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/provider/sendotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setStep("otp");
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/provider/verifyotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            otp,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setStep("success");

      setTimeout(() => {
        router.push("/provider/registerservice");
      }, 1500);
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a33] flex flex-col">
      <div className="flex-1 px-6 py-20">
        <div className="w-full max-w-6xl mx-auto">
          {/* TOP INFO */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">
              Earn More. Earn Respect. Safety Ensured.
            </h1>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Join verified service professionals across India and grow your
              income with trust, safety, and transparent payments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 items-center gap-16">
            {/* LEFT CARD */}
            <div>
              <div
                className="bg-white rounded-[32px] p-10 shadow-2xl"
                style={{
                  borderTopRightRadius: "120px",
                  borderBottomRightRadius: "120px",
                }}
              >
                {/* PHONE STEP */}
                {step === "phone" && (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      Register Here
                    </h2>
                    <p className="text-gray-500 mb-6">
                      Enter your mobile number to receive OTP
                    </p>

                    {/* PHONE INPUT */}
                    <div className="relative mb-6">
                      <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
                        Mobile Number
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-600 transition">
                        <span className="text-gray-500 mr-3">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          className="w-full outline-none"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </div>
                    </div>

                    {/* TERMS CHECKBOX */}
                    <div className="flex items-start gap-2 text-sm mb-6">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 accent-blue-600"
                      />
                      <span className="text-gray-600">
                        I agree to the{" "}
                        <Link
                          href="/legal/terms"
                          className="text-blue-600 hover:underline"
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/legal/privacy"
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </div>

                    {/* SEND OTP BUTTON */}
                    <button
                      onClick={sendOtp}
                      disabled={!agree}
                      className={`w-full font-semibold py-3 rounded-full transition shadow-lg
                        ${
                          !agree
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }
                        text-white`}
                    >
                      Send OTP →
                    </button>

                    <p className="text-xs text-gray-400 mt-4 text-center">
                      We’ll never share your number with anyone
                    </p>
                  </>
                )}

                {/* OTP STEP */}
                {step === "otp" && (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      Verify OTP
                    </h2>
                    <p className="text-gray-500 mb-6">
                      OTP sent to +91 {phone}
                    </p>

                    <input
                      type="text"
                      maxLength={6}
                      placeholder="••••••"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 text-center tracking-widest text-lg focus:border-blue-600 outline-none"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />

                    <button
                      onClick={verifyOtp}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition shadow-lg flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Continue →"
                      )}
                    </button>

                    <button
                      onClick={() => setStep("phone")}
                      className="block mx-auto mt-4 text-sm text-blue-600 hover:underline"
                    >
                      Change number
                    </button>
                  </>
                )}

                {/* SUCCESS STEP */}
                {step === "success" && (
                  <div className="text-center py-10">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      Registration Successful 🎉
                    </h2>
                    <p className="text-gray-500">
                      Redirecting you to complete profile setup…
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="hidden md:flex justify-center">
              <Image
                src="/illustrations/image.png"
                width={100}
                height={100}
                alt="Service Professional"
                className="w-[420px] max-w-full"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
