"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const EventCard = ({ event }) => {
  const { images, title, location, date, description, _id } = event;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time nicely
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  // Auto-rotate images
  useEffect(() => {
    if (!isHovering && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl bg-white dark:bg-[#1f2937] max-w-3xl">
      <div className="flex flex-col md:flex-row">
        {/* Image slider section */}
        <div 
          className="relative w-full md:w-1/3 aspect-square md:aspect-auto md:h-auto overflow-hidden group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="h-full w-full">
            {images.map((img, index) => (
              <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentImageIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
              >
            <Image
              src={img.path}
              alt={`Event ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
              </div>
            ))}
          </div>
          
          {/* Navigation arrows - only visible on hover or mobile tap */}
          {images.length > 1 && (
            <>
              <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-white rounded-full p-2 opacity-0 group-hover:opacity-90 transition-all duration-300 backdrop-blur-sm hover:scale-110"
            aria-label="Previous image"
              >
            <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-white rounded-full p-2 opacity-0 group-hover:opacity-90 transition-all duration-300 backdrop-blur-sm hover:scale-110"
            aria-label="Next image"
              >
            <ChevronRight size={18} strokeWidth={2.5} />
              </button>
              
              {/* Image indicator dots with active animation */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                ? 'w-5 bg-white' 
                : 'w-1.5 bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
              </div>
            </>
          )}
          
        {/* Show upcoming or past event badge */}
        <div className="absolute top-3 right-3">
            {new Date(date) > new Date() ? (
                <div className="bg-gradient-to-r from-[#16a34a] to-[#10b981] text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg animate-pulse">
                    Upcoming
                </div>
            ) : (
                <div className="bg-gradient-to-r from-[#d97706] to-[#f97316] text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
                    Past Event
                </div>
            )}
        </div>
        </div>
        
        {/* Content section */}
        <div className="p-5 flex flex-col justify-between w-full md:w-2/3">
          <div>
            <h2 className="text-xl font-bold mb-2 text-[#111827] dark:text-white line-clamp-2">{title}</h2>
            <div 
              className="text-[#4b5563] dark:text-[#d1d5db] text-sm mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            
            <div className="space-y-2">
              <div className="flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                <MapPin size={16} className="mr-2 text-[#6b7280] dark:text-[#9ca3af]" />
                <span className="text-sm">{location}</span>
              </div>
              
              <div className="flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                <Calendar size={16} className="mr-2 text-[#6b7280] dark:text-[#9ca3af]" />
                <span className="text-sm">{formatDate(date)}</span>
              </div>
              
              <div className="flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                <Clock size={16} className="mr-2 text-[#6b7280] dark:text-[#9ca3af]" />
                <span className="text-sm">{formatTime(date)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end items-end">
            <Link
              href={`/events/${_id}`} 
              className="px-4 py-2 text-sm font-medium text-[#2563eb] border border-[#2563eb] rounded-md hover:bg-[#2563eb] hover:text-white dark:text-[#60a5fa] dark:border-[#60a5fa] dark:hover:bg-[#60a5fa] dark:hover:text-[#0f172a] transition-colors duration-300"
            >
              See Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;