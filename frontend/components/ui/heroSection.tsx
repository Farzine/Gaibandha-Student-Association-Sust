import React from "react";
import { TextAnimate } from "./text-animate";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 text-[#1e293b] dark:bg-black dark:text-white md:py-28 lg:py-36">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMjkgMjlIMWwxLTFoMjZ2MjZsMS0xVjI5eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo or Icon */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#bae6fd] p-2 dark:bg-[#2563EB33]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-10 w-10 text-[#2563eb] dark:text-[#3b82f6]"
              >
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
              </svg>
            </div>
          </div>

          {/* Main Title with Animated Reveal */}
          <h1 className="mb-6 animate-[pulse_8s_ease-in-out_infinite] bg-gradient-to-r from-[#1e293b] via-[#2563eb] to-[#1e293b] bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent dark:from-white dark:via-[#93c5fd] dark:to-white sm:text-5xl md:text-6xl md:leading-none">
            Gaibandha Student Association
            <span className="mt-2 block text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] sm:text-3xl md:text-4xl">
              SUST
            </span>
          </h1>

          {/* Establishment Year Badge */}
          <div className="mb-8 flex justify-center">
            <div className="transform transition duration-500 hover:scale-105">
              <div className="relative rounded-xl border border-[#cbd5e1] bg-white/40 px-6 py-3 shadow-xl backdrop-blur-sm dark:border-white/20 dark:bg-white/10">
                <span className="text-sm uppercase tracking-wider text-[#1d4ed8] dark:text-[#bfdbfe]">
                  Established
                </span>
                <span className="mx-2 text-[#94a3b8] dark:text-white/40">
                  •
                </span>
                <span className="font-mono text-lg font-bold text-[#1e293b] dark:text-white">
                  2005
                </span>
                <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-[#93C5FD80] via-transparent to-[#93C5FD80] blur-lg dark:from-[#2563EB33] dark:to-[#2563EB33]"></div>
              </div>
            </div>
          </div>

          {/* Slogan with Animated Underline */}
          <div className="mb-10">
            <h3 className="relative inline-block text-xl font-medium italic text-[#2563eb] dark:text-[#93c5fd] md:text-2xl">
            <TextAnimate animation="blurInUp" by="character" once>
              "Uniting Minds, Shaping Tomorrow's Leaders"
              </TextAnimate>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#3b82f6] transition-all duration-700 group-hover:w-full dark:bg-[#60a5fa]"></span>
            </h3>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-[#e2e8f0]/80 px-6 py-3 font-medium text-[#1e293b] shadow-lg shadow-[#93C5FD80] transition-all hover:bg-[#cbd5e1]/80 hover:shadow-xl hover:shadow-[#60A5FA80] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#f1f5f9] dark:bg-white/5 dark:text-white dark:shadow-[#2563EB33] dark:hover:bg-white/10 dark:hover:shadow-[#1D4ED833] dark:focus:ring-[#2563eb] dark:focus:ring-offset-[#111827]">
              Learn More
            </button>
            <button className="rounded-lg bg-[#e2e8f0]/80 px-6 py-3 font-medium text-[#1e293b] shadow-lg shadow-[#93C5FD80] transition-all hover:bg-[#cbd5e1]/80 hover:shadow-xl hover:shadow-[#60A5FA80] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#f1f5f9] dark:bg-white/5 dark:text-white dark:shadow-[#2563EB33] dark:hover:bg-white/10 dark:hover:shadow-[#1D4ED833] dark:focus:ring-[#2563eb] dark:focus:ring-offset-[#111827]">
              Join Us
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-7 top-0 z-0 opacity-60">
        <svg
          width="550"
          height="556"
          viewBox="0 0 450 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_hero)" />
          <defs>
            <linearGradient
              id="paint0_linear_hero"
              x1="277"
              y1="-162"
              x2="277"
              y2="288"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 z-0 opacity-60">
        <svg
          width="364"
          height="201"
          viewBox="0 0 364 201"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.88545 72.3913C33.6566 66.331 220.082 -15.6019 233.474 38.0546C246.866 91.7112 -47.141 197.925 13.7284 143.539C74.5975 89.1523 176.483 57.2881 203.421 105.795C230.36 154.302 122.236 168.533 156.42 199.238"
            stroke="url(#paint1_linear_hero)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient
              id="paint1_linear_hero"
              x1="184.389"
              y1="69.2405"
              x2="184.389"
              y2="212.674"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Animated Particles */}
      {/* <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-2 w-2 animate-[ping_4s_ease-in-out_infinite] rounded-full bg-[#60A5FA4C] dark:bg-[#3b82f6]/30"></div>
        <div className="absolute left-3/4 top-1/2 h-2 w-2 animate-[ping_7s_ease-in-out_infinite] rounded-full bg-[#60A5FA4C] dark:bg-[#3b82f6]/30"></div>
        <div className="absolute left-1/2 top-3/4 h-2 w-2 animate-[ping_5s_ease-in-out_infinite] rounded-full bg-[#60A5FA4C] dark:bg-[#3b82f6]/30"></div>
      </div> */}
    </section>
  );
};

export default HeroSection;
