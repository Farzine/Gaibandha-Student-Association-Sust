"use client"
import React,{ useState, useEffect } from 'react'
import { AnimatedCarousel } from '../ui/animated-carousel';

function HeroImage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/heroSectionImage/`);
        const data = await response.json();
        
        if (response.ok) {
          setImages(data.data); // Assuming data.data is the array of images
          setLoading(false);
        } else {
          throw new Error(data.message || "Failed to fetch images");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-[#f3f4f6] dark:bg-[#172031] rounded-lg overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
          {/* Skeleton loader that resembles a carousel */}
          <div className="w-full h-full relative animate-pulse">
            <div className="absolute inset-0 bg-[#e5e7eb] rounded-lg"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="h-6 bg-[#d1d5db] rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-[#d1d5db] rounded w-1/2"></div>
            </div>
            {/* Skeleton for navigation dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#d1d5db]"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with professional styling
  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center bg-[#fef2f2] dark:bg-[#172031] rounded-lg shadow-md">
        <div className="text-center p-6 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#ef4444] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-[#f84d4d] mb-2">Unable to load images</h3>
          <p className="text-sm text-[#dc2626]">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#dc2626] text-white rounded-md hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No images state
  if (images.length === 0) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center bg-[#f9fafb] dark:bg-[#172031] rounded-lg shadow-md">
        <div className="text-center p-6 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#9ca3af] dark:text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        <h3 className="text-lg font-medium text-[#374151] dark:text-[#f3f4f6] mb-2">No Images Available</h3>
          <p className="text-sm text-[#6b7280] dark:text-[#d1d5db]">There are currently no images to display in the carousel.</p>
        </div>
      </div>
    );
  }

  const slides = images.map(image => ({
    id: image._id,
    image: image.path, 
    title: image.title,
    description: image.description || "No description available", 
  }));

  return (
        <AnimatedCarousel 
          slides={slides}
        />
  )
}

export default HeroImage