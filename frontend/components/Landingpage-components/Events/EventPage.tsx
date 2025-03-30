"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Event } from "./types";
import EventCard from "./EventCard";
import { SparklesText } from "@/components/ui/sparkles-text";
import { TextAnimate } from "@/components/ui/text-animate";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(3);

  const baseUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${baseUrl}/adminTask/event`);
      if (res.data.success) {
        // Sort events by date (newest first)
        const sortedEvents = [...res.data.data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setEvents(sortedEvents);
      } else {
        setError("Failed to fetch events");
      }
    } catch (error: any) {
      setError("Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

   // Change page
   const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  const maxPageNumbersToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);
  
  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }



  // Loading UI
  if (loading) {
    return (
      <>
      {/* Skeleton Loader */}
        <div className="mx-auto max-w-7xl w-full px-4 py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
          {/* Header Skeleton */}
          <div className="mb-12 text-center">
            <div className="relative mb-12">
              <div className="h-12 w-48 mx-auto rounded-lg bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
              <div className="mt-4 flex items-center justify-center">
                <div className="h-1 w-16 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                <div className="mx-2 h-1 w-8 rounded-full bg-[#f3f4f6] animate-pulse dark:bg-[#1f2937]"></div>
                <div className="h-1 w-4 rounded-full bg-[#f3f4f6] animate-pulse dark:bg-[#1f2937]"></div>
              </div>
            </div>
            <div className="h-4 w-3/4 mx-auto rounded bg-[#e5e7eb] animate-pulse dark:bg-[#374151] mb-2"></div>
            <div className="h-4 w-2/3 mx-auto rounded bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
          </div>
          
          {/* Events Skeleton */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:gap-10">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative">
                <div className="absolute -left-3 h-full w-1 rounded bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                <div className="overflow-hidden rounded-lg border border-[#e5e7eb] dark:border-[#1f2937]">
                  <div className="h-48 bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                  <div className="p-6">
                    <div className="mb-3 h-6 w-3/4 rounded bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                    <div className="mb-2 h-4 w-1/2 rounded bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                    <div className="mb-4 h-4 w-full rounded bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                    <div className="h-4 w-full rounded bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="h-8 w-24 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                      <div className="h-8 w-24 rounded-full bg-[#e5e7eb] animate-pulse dark:bg-[#374151]"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Error UI
  if (error) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-xl border-l-4 border-[#ef4444] bg-[#fef2f2] p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="font-medium text-[#b91c1c]">
                  Error loading events
                </p>
                <p className="mt-1 text-[#ef4444]">{error}</p>
                <button
                  onClick={fetchEvents}
                  className="mt-3 rounded bg-[#ef4444] px-4 py-2 text-white transition-colors hover:bg-[#dc2626]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if(events.length === 0) {
    return (
      <div className="min-h-screen px-4 py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-8 animate-fade-up">
              <SparklesText text="No Events Yet" className="mb-4" />
              <div className="mt-4 flex items-center justify-center">
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa]"></div>
                <div className="mx-2 h-1 w-8 rounded-full bg-[#d1d5db] dark:bg-[#374151]"></div>
                <div className="h-1 w-4 rounded-full bg-[#e5e7eb] dark:bg-[#1f2937]"></div>
              </div>
            </div>
            <div className="max-w-lg animate-fade-up delay-150">
              <TextAnimate
                animation="blurInUp"
                by="word"
                once
                className="text-lg text-[#4b5563] dark:text-[#d1d5db]"
              >
                We're currently organizing new events. Check back soon for upcoming activities and gatherings.
              </TextAnimate>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className=" min-h-screen px-4 py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="relative mb-12">
              <SparklesText text="All Events" className="" />
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
              Discover and join our latest events. From workshops to social
              gatherings, there&apos;s something for everyone.
            </TextAnimate>
          </div>
          {/* Events */}
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:gap-10">
              {currentEvents.map((event, index) => (
                <div
                  key={event._id}
                  className={`relative transform transition-all duration-500 hover:scale-[1.02] ${
                    index % 2 === 0 ? "animate-fade-right" : "animate-fade-left"
                  }`}
                >
                  <div className="absolute -left-3 h-full w-1 rounded bg-gradient-to-b from-primary/80 to-primary/20"></div>
                  <EventCard event={event} />
                  {index < currentEvents.length - 1 && (
                    <div className="via-[#d1d5db] dark:via-[#374151] absolute bottom-0 left-1/2 h-px w-1/3 -translate-x-1/2 transform bg-gradient-to-r from-transparent to-transparent"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
          {events.length > eventsPerPage && (
            <div
              className="wow fadeInUp -mx-4 flex flex-wrap"
              data-wow-delay=".15s"
            >
              <div className="w-full px-4">
                <ul className="flex items-center justify-center pt-8">
                  <li className="mx-1">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition ${
                        currentPage === 1
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-primary hover:bg-opacity-100 hover:text-white"
                      }`}
                    >
                      Prev
                    </button>
                  </li>
                  
                  {startPage > 1 && (
                    <>
                      <li className="mx-1">
                        <button
                          onClick={() => paginate(1)}
                          className={`flex h-9 min-w-[36px] items-center justify-center rounded-md ${
                            currentPage === 1
                              ? "bg-primary bg-opacity-100 text-white"
                              : "bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white"
                          } px-4 text-sm transition`}
                        >
                          1
                        </button>
                      </li>
                      {startPage > 2 && (
                        <li className="mx-1">
                          <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                            ...
                          </span>
                        </li>
                      )}
                    </>
                  )}
                  
                  {pageNumbers.map((number) => (
                    <li key={number} className="mx-1">
                      <button
                        onClick={() => paginate(number)}
                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-md ${
                          currentPage === number
                            ? "bg-primary bg-opacity-100 text-white"
                            : "bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white"
                        } px-4 text-sm transition`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  
                  {endPage < totalPages && (
                    <>
                      {endPage < totalPages - 1 && (
                        <li className="mx-1">
                          <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                            ...
                          </span>
                        </li>
                      )}
                      <li className="mx-1">
                        <button
                          onClick={() => paginate(totalPages)}
                          className={`flex h-9 min-w-[36px] items-center justify-center rounded-md ${
                            currentPage === totalPages
                              ? "bg-primary bg-opacity-100 text-white"
                              : "bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white"
                          } px-4 text-sm transition`}
                        >
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}
                  
                  <li className="mx-1">
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition ${
                        currentPage === totalPages
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-primary hover:bg-opacity-100 hover:text-white"
                      }`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default EventsPage;
