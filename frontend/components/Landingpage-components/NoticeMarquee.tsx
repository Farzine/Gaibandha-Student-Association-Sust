"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marque";

// Define the Notice type based on your schema
interface Notice {
  _id: string;
  title: string;
  created_at: string;
}

// Notice card component
const NoticeCard = ({
  title,
  created_at,
}: {
  title: string;
  created_at: string;
}) => {
  // Format date to be more readable
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={cn(
        "relative mx-3 h-full min-w-fit  md:min-w-60 md:max-w-md cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-black/20 bg-black/5 hover:bg-[#11182708]",
        // dark styles
        "dark:border-[#11182701] dark:bg-[#F9FAFB1A] dark:hover:bg-[#F9FAFB26]",
      )}
    >
      <div className="flex flex-col">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold dark:text-white">
          {title}
        </h3>
        <p className="text-xs font-medium text-[#4b5563] dark:text-white/40">
          {formattedDate}
        </p>
      </div>
    </div>
  );
};

export function NoticeMarquee() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/notice/latest`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notices");
        }

        const data = await response.json();

        // Handle different possible API response formats
        if (Array.isArray(data)) {
          // If data is already an array
          setNotices(data);
        } else if (data && typeof data === "object") {
          // Check if the response is an object with notices inside
          if (Array.isArray(data.notices)) {
            setNotices(data.notices);
          } else if (Array.isArray(data.data)) {
            setNotices(data.data);
          } else if (data.result && Array.isArray(data.result)) {
            setNotices(data.result);
          } else {
            // If we can't find an array, create one from the single object if it looks like a notice
            if (data.title && (data._id || data.id)) {
              setNotices([data as Notice]);
            } else {
              console.error("Response format is not as expected:", data);
              setError("Invalid data format received");
            }
          }
        } else {
          console.error("Response format is not as expected:", data);
          setError("Invalid data format received");
        }
      } catch (err) {
        setError("Unable to load notices");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Show loading state with skeleton loader
  if (loading) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="mb-3 w-full">
          <div className="mx-auto h-6 w-48 animate-pulse rounded-md bg-[#e5e7eb] dark:bg-[#374151]"></div>
        </div>

        <div className="mx-auto w-full max-w-7xl">
          {/* First row of skeletons */}
          <div className="flex overflow-hidden py-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="relative mx-3 h-24 min-w-64 max-w-md animate-pulse rounded-xl border border-[#e5e7eb] p-4 dark:border-[#374151]"
                >
                  <div className="mb-2 h-4 w-3/4 rounded bg-[#e5e7eb] dark:bg-[#374151]"></div>
                  <div className="h-3 w-1/2 rounded bg-[#e5e7eb] dark:bg-[#374151]"></div>
                </div>
              ))}
          </div>

          {/* Second row of skeletons */}
          <div className="mt-5 flex overflow-hidden py-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`skeleton-rev-${i}`}
                  className="relative mx-3 h-24 min-w-64 max-w-md animate-pulse rounded-xl border border-[#e5e7eb] p-4 dark:border-[#374151]"
                >
                  <div className="mb-2 h-4 w-3/4 rounded bg-[#e5e7eb] dark:bg-[#374151]"></div>
                  <div className="h-3 w-1/2 rounded bg-[#e5e7eb] dark:bg-[#374151]"></div>
                </div>
              ))}
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white/95 via-white/70 to-transparent dark:from-[#0F172AF2] dark:via-[#0F172AB3] sm:w-1/4"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white/95 via-white/70 to-transparent dark:from-[#0F172AF2] dark:via-[#0F172AB3] sm:w-1/4"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full py-8 text-center">
        <div className="mb-3 inline-flex items-center justify-center rounded-full bg-[#fee2e2] p-2 text-[#ef4444] dark:bg-[#1F293721] dark:text-[#f87171]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#4b5563] dark:text-[#d1d5db]">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          Try again
        </button>
      </div>
    );
  }

  // Show empty state if no notices
  if (notices.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <div className="mb-3 inline-flex items-center justify-center rounded-full bg-[#f3f4f6] p-2 text-[#6b7280] dark:bg-[#1f2937] dark:text-[#9ca3af]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#4b5563] dark:text-[#d1d5db]">
          No notices available at the moment
        </p>
        <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9ca3af]">
          Check back later for updates
        </p>
      </div>
    );
  }

  // Ensure we have a minimum number of notices for the marquee effect
  const extendedNotices =
    notices.length < 4
      ? [...notices, ...notices, ...notices, ...notices].slice(0, 8)
      : notices;

  // Split notices into two rows for alternating direction
  const halfwayPoint = Math.ceil(extendedNotices.length / 2);
  const firstRow = extendedNotices.slice(0, halfwayPoint);
  const secondRow = extendedNotices.slice(halfwayPoint);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-20">
      <div className="mb-6 w-full">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 animate-pulse text-primary dark:text-primary/90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h2 className="group relative flex items-center text-center text-2xl font-bold dark:text-white">
            <span className="relative inline-block bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
              Latest Notices
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 group-hover:w-full"></span>
            </span>
            <div className="ml-2 flex h-3 w-3 mt-1">
              <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
            </div>
          </h2>
        </div>
        <div className="mx-auto max-w-sm">
          <p className="animate-fade-in text-center text-sm text-[#6b7280] dark:text-[#9ca3af]">
            Stay updated with our most recent announcements
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-8xl">
        <Marquee pauseOnHover className="[--duration:35s] [--gap:1.25rem]">
          {firstRow.map((notice, index) => {
            const isRecent =
              new Date(notice.created_at) >
              new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
            return (
              <div key={notice._id || `notice-${index}`} className="relative">
                {isRecent && (
                  <span className="absolute -right-1 -top-1 z-10 flex h-5 w-12 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white shadow-md">
                    NEW
                  </span>
                )}
                <NoticeCard
                  title={notice.title}
                  created_at={notice.created_at}
                />
              </div>
            );
          })}
        </Marquee>

        {secondRow.length > 0 && (
          <Marquee
            reverse
            pauseOnHover
            className="mt-5 [--duration:40s] [--gap:1.25rem]"
          >
            {secondRow.map((notice, index) => {
              const isRecent =
                new Date(notice.created_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return (
                <div
                  key={notice._id || `notice-rev-${index}`}
                  className="relative"
                >
                  {isRecent && (
                    <span className="absolute -right-1 -top-1 z-10 flex h-5 w-12 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white shadow-md">
                      NEW
                    </span>
                  )}
                  <NoticeCard
                    title={notice.title}
                    created_at={notice.created_at}
                  />
                </div>
              );
            })}
          </Marquee>
        )}
      </div>

      {/* Professional gradient overlays */}
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white/95 via-white/70 to-transparent dark:from-[#0F172AF2] dark:via-[#0F172AB3] md:w-20 lg:w-1/6"></div>
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-r from-transparent via-white/70 to-white/95 dark:via-[#0F172AB3] dark:to-[#0F172AF2] md:w-20 lg:w-1/6"></div>
    </div>
  );
}
