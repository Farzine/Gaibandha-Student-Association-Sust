import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineClose, AiOutlineDownload } from "react-icons/ai";
import { IoExpand } from "react-icons/io5";

interface ImageholderProps {
  src: string;
  desc: string;
  year: number;
}

const Imageholder: React.FC<ImageholderProps> = ({ src, desc, year }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Prevent zoom panel from closing when clicking on the image
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="relative group overflow-hidden rounded-lg shadow-md bg-white dark:bg-[#1f2937] transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-square">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f3f4f6] dark:bg-[#374151]">
              <div className="w-8 h-8 border-4 border-[#e5e7eb] dark:border-[#4b5563] border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={src}
            alt={desc}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="font-medium truncate">{desc}</h3>
            <p className="text-xs text-[#e5e7eb]">{year}</p>
          </div>
          
          <button
            onClick={toggleZoom}
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Expand image"
          >
            <IoExpand size={16} />
          </button>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/90 backdrop-blur-sm transition-all duration-300"
          onClick={toggleZoom}
        >
          <div
            className="relative max-w-5xl w-full h-full p-4 md:p-8 flex items-center justify-center"
            onClick={handleModalClick}
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={desc}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>

            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm p-4 rounded-lg text-white">
              <h2 className="text-xl font-semibold mb-1">{desc}</h2>
              <p className="text-[#d1d5db]">{year}</p>
            </div>

            <button
              className="absolute top-6 right-6 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200"
              onClick={toggleZoom}
              title="Close"
            >
              <AiOutlineClose size={24} />
            </button>

            <Link
              href={src}
              download
              className="absolute top-6 left-6 bg-primary hover:bg-primary/80 text-white rounded-full p-3 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
              title="Download image"
            >
              <AiOutlineDownload size={24} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Imageholder;