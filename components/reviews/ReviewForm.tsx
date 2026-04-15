"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, X, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ErrorState {
  type: "duplicate" | "server" | "validation" | null;
  message: string;
}

interface ReviewFormData {
  name: string;
  email: string;
  service: string;
  rating: number;
  review: string;
}

const API = process.env.NEXT_PUBLIC_BACKEND_URL

export default function ReviewForm() {
  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    email: "",
    service: "",
    rating: 0,
    review: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ type: null, message: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // Clear error when user starts typing again
    if (error.type) {
      setError({ type: null, message: "" });
    }
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRating = (rating: number) => {
    // Clear error when user changes rating
    if (error.type) {
      setError({ type: null, message: "" });
    }
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors and success
    setError({ type: null, message: "" });
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/reviews/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error types
        if (res.status === 409 || data.error?.toLowerCase().includes("already submitted")) {
          throw new Error("DUPLICATE_REVIEW");
        }
        if (res.status === 400) {
          throw new Error("VALIDATION_ERROR");
        }
        throw new Error(data.error || "Something went wrong");
      }

      // Success
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        service: "",
        rating: 0,
        review: "",
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error(error);
      
      // Set user-friendly error messages
      if (error instanceof Error && error.message === "DUPLICATE_REVIEW") {
        setError({
          type: "duplicate",
          message: "You have already submitted a review for this service. Thank you for your feedback!",
        });
      } else if (error instanceof Error && error.message === "VALIDATION_ERROR") {
        setError({
          type: "validation",
          message: "Please check all fields and try again.",
        });
      } else {
        setError({
          type: "server",
          message: "Unable to submit your review. Please check your connection and try again later.",
        });
      }
      
      // Auto-hide error after 5 seconds
      setTimeout(() => setError({ type: null, message: "" }), 5000);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#F5F9FF] border-0 shadow-xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert - Duplicate */}
          {error.type === "duplicate" && (
            <div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-400 p-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Review Already Submitted
                  </h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>{error.message}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setError({ type: null, message: "" })}
                  className="ml-auto pl-3"
                >
                  <X className="h-5 w-5 text-yellow-400 hover:text-yellow-600" />
                </button>
              </div>
            </div>
          )}

          {/* Error Alert - Validation */}
          {error.type === "validation" && (
            <div className="rounded-lg bg-orange-50 border-l-4 border-orange-400 p-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-orange-800">
                    Validation Error
                  </h3>
                  <div className="mt-1 text-sm text-orange-700">
                    <p>{error.message}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setError({ type: null, message: "" })}
                  className="ml-auto pl-3"
                >
                  <X className="h-5 w-5 text-orange-400 hover:text-orange-600" />
                </button>
              </div>
            </div>
          )}

          {/* Error Alert - Server */}
          {error.type === "server" && (
            <div className="rounded-lg bg-red-50 border-l-4 border-red-400 p-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Submission Failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{error.message}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setError({ type: null, message: "" })}
                  className="ml-auto pl-3"
                >
                  <X className="h-5 w-5 text-red-400 hover:text-red-600" />
                </button>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="rounded-lg bg-green-50 border-l-4 border-green-400 p-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Review Submitted Successfully!
                  </h3>
                  <div className="mt-1 text-sm text-green-700">
                    <p>Thank you for your valuable feedback! 🌟</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#343A40] mb-2">
                Your Name *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#343A40] mb-2">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                disabled={loading}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-2">
              Service Used *
            </label>
            <select
              id="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
              disabled={loading}
            >
              <option value="">Select service</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="ac-repair">AC Repair</option>
              <option value="laptop-repair">Laptop Repair</option>
              <option value="car-mechanic">Car Mechanic</option>
              <option value="carpentry">Carpentry</option>
              <option value="painting">Painting</option>
              <option value="cooler-repair">Cooler Repair</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-3">
              Overall Rating *
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => !loading && handleRating(star)}
                  className={`h-8 w-8 cursor-pointer transition-all duration-200 hover:scale-110 ${
                    star <= formData.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 hover:text-gray-400"
                  } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                />
              ))}
            </div>
            {formData.rating === 0 && (
              <p className="text-xs text-gray-500 mt-2">Click on stars to rate</p>
            )}
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-2">
              Your Review *
            </label>
            <textarea
              id="review"
              rows={4}
              value={formData.review}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Tell us about your experience..."
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters recommended
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#007BFF] hover:bg-blue-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Review"
              )}
            </Button>

            <Button
              type="reset"
              variant="outline"
              onClick={() => {
                if (!loading) {
                  setFormData({
                    name: "",
                    email: "",
                    service: "",
                    rating: 0,
                    review: "",
                  });
                  setError({ type: null, message: "" });
                  setSuccess(false);
                }
              }}
              disabled={loading}
              className="transition-all duration-200"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}