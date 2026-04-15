"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // assuming you have this utility

interface Review {
  id: number;
  name: string;
  email: string;
  service: string;
  rating: number;
  review: string;
}
  const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function TopReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);


  const REVIEWS_PER_PAGE = 6; // Increased for better impact

  // Fetch reviews
const fetchReviews = useCallback(async () => {

  try {
    setLoading(true);
    setError(null);

    const res = await fetch(`${API}/api/reviews/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to fetch customer reviews");
    }

    const data: Review[] = await res.json();

    const safeData = Array.isArray(data) ? data : [];

    setReviews(safeData);
    setVisibleReviews(safeData.slice(0, REVIEWS_PER_PAGE));
    setPage(1);

  } catch (err) {
    console.error("Error fetching reviews:", err);
    setError("Couldn't load reviews at the moment.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (loadingMore || visibleReviews.length >= reviews.length) return;

    setLoadingMore(true);

    const nextPage = page + 1;
    const nextVisibleReviews = reviews.slice(0, nextPage * REVIEWS_PER_PAGE);

    // Small delay for smooth UX (feels more natural)
    setTimeout(() => {
      setVisibleReviews(nextVisibleReviews);
      setPage(nextPage);
      setLoadingMore(false);
    }, 300);
  }, [page, reviews, visibleReviews.length, loadingMore]);

  // Memoized star renderer
  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-5 w-5 transition-colors",
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-slate-700"
        )}
        aria-hidden="true"
      />
    ));
  }, []);

  const hasMore =
  (visibleReviews?.length || 0) < (reviews?.length || 0);

  // Skeleton Loader
  const ReviewSkeleton = () => (
    <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-800 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-slate-800 rounded animate-pulse w-1/2" />
          </div>
        </div>

        <div className="flex gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-5 w-5 bg-slate-800 rounded animate-pulse" />
          ))}
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 bg-slate-800 rounded animate-pulse w-11/12" />
          <div className="h-4 bg-slate-800 rounded animate-pulse w-4/5" />
        </div>

        <div className="h-3 bg-slate-800 rounded animate-pulse w-1/3 mt-8" />
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#0F172A] relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-[#0F172A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">

          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-4">
            Trusted by real customers
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Do not just take our word for it. Here is what our customers have to say about our services.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ReviewSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchReviews}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            visibleReviews.map((review) => (
              <Card
                key={review.id}
                className="group bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
              >
                <CardContent className="p-8">
                  {/* Avatar + Name */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-white text-lg leading-none mb-1">
                        {review.name}
                      </h4>
                      <p className="text-sm text-slate-500">{review.email}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div 
                    className="flex gap-1 mb-5" 
                    aria-label={`Rated ${review.rating} out of 5 stars`}
                  >
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-slate-300 text-[15px] leading-relaxed mb-8 min-h-[120px]">
                    “{review.review}”
                  </blockquote>

                  {/* Service Tag */}
                  <div className="inline-block px-4 py-1.5 bg-slate-800 text-blue-400 text-sm font-medium rounded-full border border-slate-700">
                    {review.service}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button */}
        {!loading && !error && hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className={cn(
                "group flex items-center gap-3 px-8 py-3.5 rounded-2xl font-medium text-white",
                "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
                "transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              )}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading more reviews...
                </>
              ) : (
                <>
                  Show More Reviews
                  <span className="group-hover:translate-x-0.5 transition-transform">↓</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* End of reviews message */}
        {!loading && !error && !hasMore && reviews.length > 0 && (
          <div className="text-center mt-16 text-slate-500">
            Youve seen all {reviews.length} reviews ✨
          </div>
        )}
      </div>
    </section>
  );
}