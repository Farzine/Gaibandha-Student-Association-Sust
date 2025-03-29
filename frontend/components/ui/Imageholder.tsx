import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AiOutlineClose, AiOutlineDownload } from "react-icons/ai";


const MasonryImageGrid = ({ src, desc, year,tag }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);

  // Load image dimensions
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setDimensions({
        width: img.width,
        height: img.height,
      });
    };
    img.src = src;
  }, [src]);


  // Control header sticky state when zoomed
  useEffect(() => {
    // Create a custom event to communicate with the Header component
    if (isZoomed) {
      // Dispatch event to disable sticky navbar
      const disableStickyEvent = new CustomEvent("toggleStickyNavbar", { 
        detail: { enabled: false } 
      });
      window.dispatchEvent(disableStickyEvent);
    } else {
      // Restore sticky navbar behavior when zoom is closed
      const enableStickyEvent = new CustomEvent("toggleStickyNavbar", { 
        detail: { enabled: true } 
      });
      window.dispatchEvent(enableStickyEvent);
    }
    
    // Cleanup function
    return () => {
      // Make sure sticky behavior is restored when component unmounts
      const enableStickyEvent = new CustomEvent("toggleStickyNavbar", { 
        detail: { enabled: true } 
      });
      window.dispatchEvent(enableStickyEvent);
    };
  }, [isZoomed]);

  const toggleZoom = (e) => {
    e && e.stopPropagation();
    setIsZoomed(!isZoomed);

    // Prevent scrolling when zoomed
    if (!isZoomed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Calculate aspect ratio for the container
  const aspectRatio =
    dimensions.width > 0 ? dimensions.height / dimensions.width : 1;

  // Ensure we have a reasonable value that won't break the layout
  const normalizedAspectRatio = Math.max(0.5, Math.min(2, aspectRatio));

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 hover:shadow-xl dark:bg-[#1f2937]"
        style={{
          gridRowEnd: `span ${Math.ceil(normalizedAspectRatio * 20)}`, // Adjust span based on aspect ratio
        }}
      >
        <div className="relative h-full w-full" ref={imageRef}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f3f4f6] dark:bg-[#374151]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-primary dark:border-[#4b5563]"></div>
            </div>
          )}

          <div className="relative h-full w-full">
            <img
              src={src}
              alt={desc}
              className={`transition-opacity duration-300 w-full h-full object-cover ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>

        <div onClick={toggleZoom} className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="truncate font-medium text-sm">{desc}</h3>
            <p className="text-xs">{tag}</p>
            <p className="text-xs text-[#e5e7eb]">{year}</p>
          </div>

          {/* <button
            onClick={toggleZoom}
            className="absolute right-2 top-2 rounded-full bg-white/20 p-2 text-primary font-bold opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 group-hover:opacity-100"
            title="Expand image"
            aria-label="Expand image"
          >
            <IoExpand size={20} />
          </button> */}
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300"
          onClick={toggleZoom}
        >
          <div
            className="relative flex h-full w-full max-w-5xl items-center justify-center p-4 md:p-8"
            onClick={handleModalClick}
          >
            <div className="relative h-full w-full">
              <img
                src={src}
                alt={desc}
                className="rounded-lg w-full h-full object-contain"
              />
            </div>

            <div className="absolute bottom-6 left-6 right-6 rounded-lg bg-black/60 p-4 text-white backdrop-blur-sm md:left-1/2 md:right-auto md:w-2/3 md:-translate-x-1/2">
              <h2 className="mb-1 text-base font-semibold">{desc}</h2>
              <p className="text-[#d1d5db] text-sm">{tag}</p>
              <p className="text-[#d1d5db] text-sm">{year}</p>
            </div>

            <button
              className="absolute right-6 top-6 rounded-full bg-black/60 p-3 text-white transition-all duration-200 hover:bg-black/80"
              onClick={toggleZoom}
              title="Close"
              aria-label="Close"
            >
              <AiOutlineClose size={24} />
            </button>

            <Link
              href={src}
              download
              className="absolute left-6 top-6 rounded-full bg-primary p-3 text-white transition-all duration-200 hover:bg-primary/80"
              onClick={(e) => e.stopPropagation()}
              title="Download image"
              aria-label="Download image"
            >
              <AiOutlineDownload size={24} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MasonryImageGrid;
