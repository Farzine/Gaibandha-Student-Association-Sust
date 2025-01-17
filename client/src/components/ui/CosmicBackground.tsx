'use client';

import { useEffect } from 'react';

export default function CosmicBackground() {
  useEffect(() => {
    // Create stars
    const createStars = () => {
      const starsContainer = document.querySelector('.stars');
      if (!starsContainer) return;
      
      // Clear existing stars first
      starsContainer.innerHTML = '';
      
      for (let i = 0; i < 100; i++) { // Increased number of stars
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3 + 1}px`; // Minimum size of 1px
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
      }
    };

    // Create shooting stars
    const createShootingStar = () => {
      const starsContainer = document.querySelector('.stars');
      if (!starsContainer) return;
      
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      shootingStar.style.top = `${Math.random() * 100}%`;
      shootingStar.style.left = `${Math.random() * 100}%`;
      starsContainer.appendChild(shootingStar);
      
      setTimeout(() => {
        shootingStar.remove();
      }, 3000);
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.querySelector('.cursor-stars');
      if (!cursor) return;
      
      cursor.classList.add('visible');
      (cursor as HTMLElement).style.left = e.clientX - 50 + 'px';
      (cursor as HTMLElement).style.top = e.clientY - 50 + 'px';
    };

    // Initialize
    createStars();
    const shootingStarInterval = setInterval(createShootingStar, 4000);
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      clearInterval(shootingStarInterval);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="cosmic-background">
      <div className="stars" />
      <div className="cursor-stars" />
    </div>
  );
}