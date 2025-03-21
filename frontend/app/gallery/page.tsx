"use client";

import { useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { RiFilterLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import MasonryImageGrid from "@/components/ui/Imageholder";

interface ImageItem {
  path: string;
  public_id: string;
  description: string;
  tag: "Newcomer's welcome" | "Relief" | "Party" | "Programs" | "Others";
  year: number;
}

export default function Gallery() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [years, setYears] = useState<number[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const tags = ["Newcomer's welcome", "Relief", "Party", "Programs", "Others"];

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/gallery`,
          {
            method: "GET",
          },
        );
        if (response.ok) {
          const data: ImageItem[] = await response.json();
          setImages(data);
          setFilteredImages(data);

          // Extract unique years from the fetched images
          const uniqueYears = Array.from(
            new Set(data.map((image: ImageItem) => image.year)),
          );
          setYears(uniqueYears.sort((a: number, b: number) => b - a));
        } else {
          console.error("Error fetching images:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    // Filter images based on all criteria
    let filtered = images;

    if (selectedTag) {
      filtered = filtered.filter((image) => image.tag === selectedTag);
    }

    if (selectedYear) {
      filtered = filtered.filter((image) => image.year === selectedYear);
    }

    if (searchTerm) {
      filtered = filtered.filter((image) =>
        image.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredImages(filtered);
  }, [selectedTag, selectedYear, searchTerm, images]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(selectedYear === year ? null : year);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const clearFilters = () => {
    setSelectedTag(null);
    setSelectedYear(null);
    setSearchTerm("");
  };

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
      <main className="min-h-screen pt-20 lg:pt-[80px]">
        <div className="max-w-8xl mx-auto px-4 pb-10 pt-20 sm:px-6 lg:px-8">
          {/* Header - Fixed */}
          <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center md:mb-0">
              <CiImageOn className="mr-3 h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-[#111827] dark:text-white">
                Gallery
              </h1>
            </div>

            {/* Search bar - Fixed */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-[#d1d5db] bg-white px-4 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary dark:border-[#374151] dark:bg-[#1f2937] dark:text-white"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f9fafb] hover:text-[#374151]"
                  onClick={() => setSearchTerm("")}
                >
                  <IoClose />
                </button>
              )}
            </div>
          </div>

          {/* Mobile filter button - Fixed */}
          <div className="mb-4 md:hidden">
            <button
              className="flex w-full items-center justify-center rounded-lg border border-[#d1d5db] bg-white py-2 text-primary shadow-sm dark:border-[#374151] dark:bg-[#1f2937]"
              onClick={toggleMobileFilters}
            >
              <RiFilterLine className="mr-2" />
              {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="flex flex-col gap-6 md:flex-row">
            {/* Filters - Fixed */}
            <div
              className={`${
                mobileFiltersOpen ? "block" : "hidden"
              } flex-shrink-0 space-y-6 md:block md:w-64`}
            >
              {/* Category filter */}
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1f2937]">
                <h2 className="mb-4 text-xl font-semibold text-[#111827] dark:text-white">
                  Categories
                </h2>
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                        selectedTag === tag
                          ? "bg-primary text-white"
                          : "bg-[#f3f4f6] text-[#1f2937] hover:bg-[#e5e7eb] dark:bg-[#374151] dark:text-[#e5e7eb] dark:hover:bg-[#4b5563]"
                      }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year filter */}
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1f2937]">
                <h2 className="mb-4 text-xl font-semibold text-[#111827] dark:text-white">
                  Years
                </h2>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        selectedYear === year
                          ? "bg-primary text-white"
                          : "bg-[#f3f4f6] text-[#1f2937] hover:bg-[#e5e7eb] dark:bg-[#374151] dark:text-[#e5e7eb] dark:hover:bg-[#4b5563]"
                      }`}
                      onClick={() => handleYearClick(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters button */}
              {(selectedTag || selectedYear || searchTerm) && (
                <button
                  className="w-full rounded-lg bg-[#f3f4f6] px-3 py-2 text-[#1f2937] transition-colors hover:bg-[#e5e7eb] dark:bg-[#374151] dark:text-[#e5e7eb] dark:hover:bg-[#4b5563]"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Gallery content wrapper - Fixed with scrollable content */}
            <div className="flex-1">
              {/* Active filters - Fixed */}
              {(selectedTag || selectedYear) && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedTag && (
                    <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-3 py-1 text-sm text-primary">
                      {selectedTag}
                      <button
                        className="ml-1"
                        onClick={() => setSelectedTag(null)}
                      >
                        <IoClose />
                      </button>
                    </span>
                  )}
                  {selectedYear && (
                    <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-3 py-1 text-sm text-primary">
                      {selectedYear}
                      <button
                        className="ml-1"
                        onClick={() => setSelectedYear(null)}
                      >
                        <IoClose />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Scrollable image content container */}
              <div className="h-[calc(170vh-320px)] overflow-y-auto">
                {loading ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {[...Array(12)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-48 rounded-lg bg-[#e5e7eb] dark:bg-[#374151]"></div>
                        <div className="mt-2 h-3 w-3/4 rounded bg-[#e5e7eb] dark:bg-[#374151]"></div>
                        <div className="mt-1 h-2 w-1/2 rounded bg-[#e5e7eb] dark:bg-[#374151]"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredImages.length > 0 ? (
                    <div className="grid auto-rows-[1fr] grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {[...filteredImages]
                      .sort(() => Math.random() - 0.5)
                      .map((item, index) => (
                      <MasonryImageGrid
                        key={`${item.public_id}-${index}`}
                        src={item.path}
                        desc={item.description}
                        year={item.year}
                        tag={item.tag}
                      />
                      ))}
                    </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="mb-4 rounded-full bg-[#f3f4f6] p-4 dark:bg-[#1f2937]">
                      <CiImageOn className="h-12 w-12 text-[#f9fafb]" />
                    </div>
                    <h3 className="text-xl font-medium text-[#111827] dark:text-white">
                      No images found
                    </h3>
                    <p className="mt-2 text-[#f9fafb] dark:text-[#9ca3af]">
                      Try adjusting your filters or search term
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
