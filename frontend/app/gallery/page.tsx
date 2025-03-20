"use client";

import { useEffect, useState } from "react";
import Imageholder from "@/components/ui/Imageholder";
import { CiImageOn } from "react-icons/ci";
import { RiFilterLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Breadcrumb from "@/components/Landingpage-components/Common/Breadcrumb";

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
          }
        );
        if (response.ok) {
          const data: ImageItem[] = await response.json();
          setImages(data);
          setFilteredImages(data);

          // Extract unique years from the fetched images
          const uniqueYears = Array.from(
            new Set(data.map((image: ImageItem) => image.year))
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
        image.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    <main className="min-h-screen pt-24 lg:pt-[140px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <CiImageOn className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-[#111827] dark:text-white">
              Gallery
            </h1>
          </div>
          
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white dark:bg-[#1f2937] border border-[#d1d5db] dark:border-[#374151] focus:outline-none focus:ring-2 focus:ring-primary text-[#111827] dark:text-white"
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

        {/* Mobile filter button */}
        <div className="md:hidden mb-4">
          <button
            className="flex items-center justify-center w-full py-2 bg-white dark:bg-[#1f2937] rounded-lg shadow-sm text-primary border border-[#d1d5db] dark:border-[#374151]"
            onClick={toggleMobileFilters}
          >
            <RiFilterLine className="mr-2" />
            {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <div
            className={`${
              mobileFiltersOpen ? "block" : "hidden"
            } md:block md:w-64 space-y-6 flex-shrink-0`}
          >
            {/* Category filter */}
            <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-xl text-[#111827] dark:text-white mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`w-full py-2 px-3 rounded-lg text-left transition-colors ${
                      selectedTag === tag
                        ? "bg-primary text-white"
                        : "bg-[#f3f4f6] dark:bg-[#374151] text-[#1f2937] dark:text-[#e5e7eb] hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563]"
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Year filter */}
            <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-xl text-[#111827] dark:text-white mb-4">
                Years
              </h2>
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    className={`py-1 px-3 rounded-full text-sm font-medium transition-colors ${
                      selectedYear === year
                        ? "bg-primary text-white"
                        : "bg-[#f3f4f6] dark:bg-[#374151] text-[#1f2937] dark:text-[#e5e7eb] hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563]"
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
                className="w-full py-2 px-3 bg-[#f3f4f6] dark:bg-[#374151] text-[#1f2937] dark:text-[#e5e7eb] rounded-lg hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563] transition-colors"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Gallery content */}
          <div className="flex-1">
            {/* Active filters */}
            {(selectedTag || selectedYear) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedTag && (
                  <span className="inline-flex items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">
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
                  <span className="inline-flex items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">
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

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-[#e5e7eb] dark:bg-[#374151] h-48 rounded-lg"></div>
                    <div className="mt-2 bg-[#e5e7eb] dark:bg-[#374151] h-3 w-3/4 rounded"></div>
                    <div className="mt-1 bg-[#e5e7eb] dark:bg-[#374151] h-2 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                {filteredImages.map((item, index) => (
                  <Imageholder
                    key={index}
                    src={item.path}
                    desc={item.description}
                    year={item.year}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-[#f3f4f6] dark:bg-[#1f2937] p-4 rounded-full mb-4">
                  <CiImageOn className="w-12 h-12 text-[#f9fafb]" />
                </div>
                <h3 className="text-xl font-medium text-[#111827] dark:text-white">
                  No images found
                </h3>
                <p className="text-[#f9fafb] dark:text-[#9ca3af] mt-2">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    </>
  );
}