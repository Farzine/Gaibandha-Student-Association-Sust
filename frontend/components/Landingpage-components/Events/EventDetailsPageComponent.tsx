"use client";
import React, { useState, useEffect, use } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Users,
  Tag,
  Ticket,
  Award,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Event } from "./types";
import Head from "next/head";
import Link from "next/link";
import { SparklesText } from "@/components/ui/sparkles-text";
import { TextAnimate } from "@/components/ui/text-animate";
import toast from "react-hot-toast";

const EventDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  // Fetch event details
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${baseUrl}/adminTask/event/${params.id}`);
      if (res.data.success) {
        setEvent(res.data.data);
      } else {
        setError("Failed to fetch event details");
      }
    } catch (error: any) {
      setError("Error fetching event details");
    } finally {
      setLoading(false);
    }
  };

  // Control header sticky state when zoomed
  useEffect(() => {
    // Create a custom event to communicate with the Header component
    if (showFullGallery) {
      // Dispatch event to disable sticky navbar
      const disableStickyEvent = new CustomEvent("toggleStickyNavbar", {
        detail: { enabled: false },
      });
      window.dispatchEvent(disableStickyEvent);
    } else {
      // Restore sticky navbar behavior when zoom is closed
      const enableStickyEvent = new CustomEvent("toggleStickyNavbar", {
        detail: { enabled: true },
      });
      window.dispatchEvent(enableStickyEvent);
    }

    // Cleanup function
    return () => {
      // Make sure sticky behavior is restored when component unmounts
      const enableStickyEvent = new CustomEvent("toggleStickyNavbar", {
        detail: { enabled: true },
      });
      window.dispatchEvent(enableStickyEvent);
    };
  }, [showFullGallery]);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time nicely
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  const nextImage = () => {
    if (!event?.images?.length) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % event.images.length);
  };

  const prevImage = () => {
    if (!event?.images?.length) return;
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + event.images.length) % event.images.length,
    );
  };

  // Share event functionality
  const shareEvent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.title || "Check out this event",
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(window.location.href);
        
        toast.success('Event link copied to clipboard!', {
          duration: 3000,
          position: 'bottom-right',
          style: {
            background: '#1f2937',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
          },
          icon: '✓',
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback if sharing fails
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Event link copied to clipboard!');
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
        toast.error('Could not share or copy link. Please try again.');
      }
    }
  };

  // Close gallery when ESC key is pressed or when clicking outside the image
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowFullGallery(false);
      }
    };

    const handleOutsideClick = (e) => {
      // Close if clicking outside the image (on the dark overlay)
      if (e.target.classList.contains("fixed")) {
        setShowFullGallery(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const onBack = () => {
    router.push("/events");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
        {/* Back button skeleton */}
        <div className="w-32 h-10 rounded-lg bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
        
        {/* Section Header skeleton */}
        <div className="text-center flex flex-col items-center space-y-6">
          <div className="w-3/4 h-12 bg-[#e5e7eb] rounded-lg animate-pulse dark:bg-[#374151]"></div>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-1 w-16 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
            <div className="h-1 w-8 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
            <div className="h-1 w-4 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
          </div>
          <div className="w-1/2 h-6 bg-[#e5e7eb] rounded-lg animate-pulse dark:bg-[#374151]"></div>
        </div>
        
        {/* Main content skeleton */}
        <div className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-[#1f2937] mt-10">
          {/* Hero section skeleton */}
          <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh] lg:h-[70vh] bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
          
          <div className="overflow-hidden rounded-b-xl bg-white shadow-lg dark:bg-[#1f2937] lg:flex">
            {/* Left content skeleton */}
            <div className="p-5 sm:p-6 lg:w-2/3 lg:p-8 space-y-8">
              {/* Title skeleton */}
              <div className="h-10 w-3/4 bg-[#e5e7eb] rounded-lg animate-pulse dark:bg-[#374151]"></div>
              
              {/* Event details skeleton */}
              <div className="flex flex-wrap gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center">
                    <div className="mr-3 rounded-full w-10 h-10 bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                    <div className="space-y-2">
                      <div className="h-5 w-24 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                      <div className="h-4 w-16 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* About section skeleton */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-3 h-6 w-1 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                  <div className="h-7 w-40 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                  <div className="h-4 w-full bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                  <div className="h-4 w-3/4 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                </div>
              </div>
              
              {/* Organizer skeleton */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-3 h-6 w-1 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                  <div className="h-7 w-40 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                </div>
                <div className="flex items-center p-4 rounded-lg border border-[#f3f4f6] dark:border-[#374151] bg-[#f9fafb] dark:bg-[#1f2937]/50">
                  <div className="mr-4 h-16 w-16 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                    <div className="h-4 w-32 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                  </div>
                </div>
              </div>
              
              {/* Gallery skeleton */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-3 h-6 w-1 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                  <div className="h-7 w-48 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#374151]"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-24 sm:h-32 rounded-lg bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right sidebar skeleton */}
            <div className="bg-[#f9fafb] p-5 dark:bg-[#1f2937]/80 sm:p-6 lg:w-1/3 lg:p-8">
              <div className="rounded-xl border border-[#f3f4f6] dark:border-[#374151] bg-white p-6 shadow-md dark:bg-[#374151] space-y-6">
                <div className="flex items-center">
                  <div className="mr-2 h-5 w-5 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#4b5563]"></div>
                  <div className="h-7 w-3/4 bg-[#e5e7eb] rounded animate-pulse dark:bg-[#4b5563]"></div>
                </div>
                
                <div className="border-t border-[#f3f4f6] dark:border-[#4b5563] pt-6 space-y-4">
                  <div className="flex items-center">
                    <div className="mr-3 h-5 w-5 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#4b5563]"></div>
                    <div className="h-5 w-full bg-[#e5e7eb] rounded animate-pulse dark:bg-[#4b5563]"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 h-5 w-5 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#4b5563]"></div>
                    <div className="h-5 w-full bg-[#e5e7eb] rounded animate-pulse dark:bg-[#4b5563]"></div>
                  </div>
                </div>
                
                <div className="h-12 w-full rounded-lg bg-[#e5e7eb] animate-pulse dark:bg-[#4b5563]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] p-4 dark:bg-[#111827]">
        <div className="w-full max-w-md rounded-lg border-l-4 border-[#ef4444] bg-[#fef2f2] p-6 shadow-md">
          <h2 className="mb-2 text-xl font-bold text-[#b91c1c] dark:text-[#f87171]">
            Error
          </h2>
          <p className="mb-4 text-[#dc2626] dark:text-[#fca5a5]">
            {error || "Member not found"}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => fetchEventDetails()}
              className="rounded bg-[#dc2626] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#b91c1c]"
            >
              Try Again
            </button>
            <Link href="/events">
              <button className="rounded bg-[#e5e7eb] px-4 py-2 text-[#1f2937] transition-colors duration-200 hover:bg-[#d1d5db] dark:bg-[#374151] dark:text-[#e5e7eb] dark:hover:bg-[#4b5563]">
                Back to Members
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Process images
  const imageUrls =
    event.images?.map((img) => (typeof img === "string" ? img : img.path)) ||
    [];

  return (
    <>
      <div>
        <span className="absolute left-0 top-0 z-[-1]">
          <svg
            width="287"
            height="254"
            viewBox="0 0 287 254"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z"
              fill="url(#paint0_linear_111:578)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_111:578"
                x1="-40.5"
                y1="117"
                x2="301.926"
                y2="-97.1485"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute right-0 top-0 z-[-1]">
          <svg
            width="628"
            height="258"
            viewBox="0 0 628 258"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z"
              fill="url(#paint0_linear_0:1)"
            />
            <path
              opacity="0.1"
              d="M0.0716344 182.78L101.988 -15.0769L142.154 81.4093L0.0716344 182.78Z"
              fill="url(#paint1_linear_0:1)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_0:1"
                x1="644"
                y1="221"
                x2="429.946"
                y2="37.0429"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_0:1"
                x1="18.3648"
                y1="166.016"
                x2="105.377"
                y2="32.3398"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
      <div className="mx-auto max-w-7xl py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4 md:py-6">
          <button
            onClick={onBack}
            className="group flex items-center rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm transition-all hover:bg-[#f9fafb] hover:text-primary dark:border-[#374151] dark:bg-[#1f2937] dark:text-[#d1d5db] dark:hover:bg-[#374151] dark:hover:text-white md:text-base"
            aria-label="Back to Events"
          >
            <ArrowLeft
              size={18}
              className="mr-2 transition-transform group-hover:-translate-x-1"
            />
            <span>Back to Events</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="relative mb-12">
            <SparklesText text={event.title} />
            <div className="mt-4 flex items-center justify-center">
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa]"></div>
              <div className="mx-2 h-1 w-8 rounded-full bg-[#d1d5db] dark:bg-[#374151]"></div>
              <div className="h-1 w-4 rounded-full bg-[#e5e7eb] dark:bg-[#1f2937]"></div>
            </div>
            <div className="absolute left-1/2 top-1/2 -z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary opacity-10 blur-3xl"></div>
          </div>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-lg text-[#4b5563] dark:text-[#d1d5db]"
          >
            An exclusive event by Gaibandha Student Association
          </TextAnimate>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 pb-16 pt-6">
          <div className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-[#1f2937]">
            {/* Hero section with improved image display */}
            <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh] lg:h-[70vh]">
              <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 to-transparent"></div>
              <img
                src={imageUrls[currentImageIndex]}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                onClick={() => setShowFullGallery(true)}
              />

              {/* Navigation arrows with improved styling */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-black/30 p-3 text-white transition-all hover:bg-white hover:text-black"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-black/30 p-3 text-white transition-all hover:bg-white hover:text-black"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image count indicator with improved styling */}
              <div
                className="absolute bottom-6 right-6 z-20 cursor-pointer rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-black/70"
                onClick={() => setShowFullGallery(true)}
              >
                {currentImageIndex + 1}/{imageUrls.length}{" "}
                <span className="hidden sm:inline">Photos</span>
              </div>

              {/* Event title overlay for mobile */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6 lg:hidden">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  {event.title}
                </h1>
              </div>
            </div>

            <div className="overflow-hidden rounded-b-xl bg-white shadow-lg dark:bg-[#1f2937] lg:flex">
              {/* Left content - Event details with improved spacing and typography */}
              <div className="p-5 sm:p-6 lg:w-2/3 lg:p-8">
                <h1 className="mb-5 hidden text-2xl font-bold text-[#111827] dark:text-white sm:text-3xl lg:block">
                  {event.title}
                </h1>

                <div className="mb-8 flex flex-wrap gap-6">
                  <div className="group flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                    <div className="bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 mr-3 rounded-full p-2 transition-colors">
                      <Calendar
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <div className="font-medium">
                        {formatDate(event.date)}
                      </div>
                      <div className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
                        {formatTime(event.date)}
                      </div>
                    </div>
                  </div>

                  <div className="group flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                    <div className="bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 mr-3 rounded-full p-2 transition-colors">
                      <MapPin
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{event.location}</div>
                      <div className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
                        Venue
                      </div>
                    </div>
                  </div>

                  <div className="group flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                    <div className="bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 mr-3 rounded-full p-2 transition-colors">
                      <Users
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{"For all members"}</div>
                      <div className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
                        Capacity
                      </div>
                    </div>
                  </div>
                </div>

                {/* About this event section with improved typography */}
                <div className="mb-8">
                  <h2 className="mb-4 flex items-center text-xl font-semibold text-[#111827] dark:text-white">
                    <span className="bg-blue-600 dark:bg-blue-400 mr-3 inline-block h-6 w-1 rounded"></span>
                    About This Event
                  </h2>
                  <div className="prose prose-blue prose-lg max-w-none leading-relaxed text-[#374151] dark:prose-invert dark:text-[#d1d5db]">
                    {event.description ? (
                      <div 
                        className="event-description"
                        dangerouslySetInnerHTML={{ 
                          __html: event.description.replace(/\n/g, '<br />') 
                        }}
                        aria-label="Event description"
                      />
                    ) : (
                      <p className="italic text-[#6b7280] dark:text-[#9ca3af]">
                        No detailed description is available for this event. Please contact the organizers for more information.
                      </p>
                    )}
                  </div>
                </div>

                {/* Organizer with improved styling */}
                <div className="mb-8">
                  <h2 className="mb-4 flex items-center text-xl font-semibold text-[#111827] dark:text-white">
                    <span className="bg-blue-600 dark:bg-blue-400 mr-3 inline-block h-6 w-1 rounded"></span>
                    Organized By
                  </h2>
                  <div className="border-[#f3f4f6] dark:border-[#374151] bg-[#f9fafb] dark:bg-[#1f2937]/50 hover:bg-[#f3f4f6] dark:hover:bg-[#374151]/50 flex items-center rounded-lg border p-4 transition-colors">
                    <div className="dark:border-[#374151] mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-md">
                      <img
                        src="/images/user/user-01.png"
                        alt="Organizer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-lg font-medium text-[#111827] dark:text-white">
                        {"Gaibandha Student Association"}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-[#6b7280] dark:text-[#9ca3af]">
                        <Award size={14} className="mr-1" />
                        Event Organizer
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo gallery preview with improved grid and hover effects */}
                <div>
                  <h2 className="mb-4 flex items-center text-xl font-semibold text-[#111827] dark:text-white">
                    <span className="bg-blue-600 dark:bg-blue-400 mr-3 inline-block h-6 w-1 rounded"></span>
                    Previous Event Gallery
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    {imageUrls.slice(0, 3).map((img, index) => (
                      <div
                        key={index}
                        className="group relative h-24 cursor-pointer overflow-hidden rounded-lg sm:h-32"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setShowFullGallery(true);
                        }}
                      >
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20"></div>
                        {index === 2 && imageUrls.length > 3 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-medium text-white">
                            +{imageUrls.length - 3} more
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right sidebar - Ticket info with improved styling */}
              <div className="bg-[#f9fafb] p-5 dark:bg-[#1f2937]/80 sm:p-6 lg:w-1/3 lg:p-8">
                <div className="border-[#f3f4f6] dark:border-[#374151] rounded-xl border bg-white p-6 shadow-md dark:bg-[#2d3748]">
                  <h2 className="mb-6 flex items-center text-xl font-semibold text-[#111827] dark:text-white">
                    <AlertCircle size={20} className="text-amber-500 mr-2" />
                    Attention Please!
                  </h2>

                  {/* Event details summary with improved icons */}
                  <div className="mb-6 space-y-4 border-t border-[#e5e7eb] pt-6 dark:border-[#4b5563]">
                    <div className="flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                      <Calendar
                        size={18}
                        className="text-blue-600 dark:text-blue-400 mr-3"
                      />
                      <span>
                        {formatDate(event.date)} • {formatTime(event.date)}
                      </span>
                    </div>
                    <div className="flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                      <MapPin
                        size={18}
                        className="text-blue-600 dark:text-blue-400 mr-3"
                      />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Share button with improved styling */}
                  <button
                    onClick={shareEvent}
                    className="border-[#e5e7eb] hover:bg-[#f9fafb] flex w-full items-center justify-center rounded-lg border bg-white py-3 font-medium text-[#374151] transition-all hover:shadow-sm dark:border-[#4b5563] dark:bg-[#374151] dark:text-[#d1d5db] dark:hover:bg-[#3e4c5e]"
                  >
                    <Share2 size={18} className="mr-2" />
                    Share This Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full screen gallery */}
        {showFullGallery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <button
              onClick={() => setShowFullGallery(false)}
              className="absolute right-6 top-6 z-10 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 transform rounded-full bg-black/40 p-3 text-white transition-colors hover:bg-black/60"
              aria-label="Previous image"
            >
              <ChevronLeft size={30} />
            </button>

            <img
              src={imageUrls[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="max-h-[85vh] max-w-[85vw] object-contain"
            />

            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 transform rounded-full bg-black/40 p-3 text-white transition-colors hover:bg-black/60"
              aria-label="Next image"
            >
              <ChevronRight size={30} />
            </button>

            <div className="absolute bottom-6 w-full text-center text-white">
              <div className="mb-4">
                {currentImageIndex + 1} / {imageUrls.length}
              </div>
              <div className="flex justify-center space-x-2">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-16 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/30"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventDetailsPage;
