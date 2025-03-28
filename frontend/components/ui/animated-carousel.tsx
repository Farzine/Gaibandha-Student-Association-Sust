"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Slide {
  id: number
  image: string
  title: string
  description: string
}

interface AnimatedCarouselProps {
  slides: Slide[]
  autoPlayInterval?: number
  showControls?: boolean
  showIndicators?: boolean
}

export function AnimatedCarousel({
  slides,
  autoPlayInterval = 4000,
  showControls = true,
  showIndicators = true,
}: AnimatedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return

      setIsAnimating(true)
      setCurrentIndex(index)

      // Reset animation state after transition completes
      setTimeout(() => {
        setIsAnimating(false)
      }, 500)
    },
    [isAnimating],
  )

  const goToNextSlide = useCallback(() => {
    const newIndex = (currentIndex + 1) % slides.length
    goToSlide(newIndex)
  }, [currentIndex, goToSlide, slides.length])

  const goToPrevSlide = useCallback(() => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length
    goToSlide(newIndex)
  }, [currentIndex, goToSlide, slides.length])

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      goToNextSlide()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [currentIndex, goToNextSlide, autoPlayInterval, isPaused])

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel container */}
      <div className="relative h-[450px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out",
              index === currentIndex
                ? "translate-x-0 opacity-100"
                : index < currentIndex
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0",
            )}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="object-cover w-full h-full"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2 animate-fadeIn">{slide.title}</h2>
              <p className="animate-fadeIn animation-delay-200">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      {showControls && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPrevSlide}
            disabled={isAnimating}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-sm" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToNextSlide}
            disabled={isAnimating}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-sm" />
            <span className="sr-only">Next slide</span>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80",
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

