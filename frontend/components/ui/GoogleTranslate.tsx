'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

// Define types for Google Translate API
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (options: {
          pageLanguage: string;
          includedLanguages?: string;
          layout?: google.translate.TranslateElementLayout;
          autoDisplay?: boolean;
        }, elementId: string) => void;
        TranslateElementInit: () => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

// Define namespace for Google Translate types
namespace google.translate {
  export enum TranslateElementLayout {
    SIMPLE = 'SIMPLE',
    HORIZONTAL = 'HORIZONTAL',
    VERTICAL = 'VERTICAL',
  }
}

const GoogleTranslate = () => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize Google Translate
  useEffect(() => {
    // Define the callback function that Google Translate will call
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,bn', // Only include English and Bengali
          layout: google.translate.TranslateElementLayout.SIMPLE,
          autoDisplay: false,
        },
        'google-translate-element'
      );
      setIsLoaded(true);
    };

    // Add styles to hide Google Translate widget elements
    const style = document.createElement('style');
    style.innerHTML = `
      .skiptranslate, .goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
    `;
    document.head.appendChild(style);

    // Clean up
    return () => {
      document.head.removeChild(style);
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Handle language change
  useEffect(() => {
    if (!isLoaded) return;

    // Helper function to change language
    const changeLanguage = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      if (selectElement) {
        // This is where the fix is needed - we need to send the correct value to Google Translate
        selectElement.value = language;
        selectElement.dispatchEvent(new Event('change'));
      }
    };

    // We need a small delay to ensure the Google Translate elements are ready
    const timeoutId = setTimeout(changeLanguage, 300);

    return () => clearTimeout(timeoutId);
  }, [language, isLoaded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Change language directly without toggling
  const changeLanguage = (newLanguage: 'en' | 'bn') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hidden element for Google Translate API */}
      <div id="google-translate-element" className="hidden" />

    {/* Load Google Translate script */}
    <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
    />

    {/* Custom Dropdown UI - Footer Responsive */}
    <div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-md dark:bg-black bg-white border hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
        >
            <span className="font-medium dark:text-white text-black">
                {language === 'en' ? 'English' : 'বাংলা'}
            </span>
            <svg
                className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
            </svg>
        </button>

        {isOpen && (
            <div className="absolute bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 right-0 w-32 sm:w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`block w-full text-left px-3 py-1.5 text-xs sm:text-sm ${
                            language === 'en'
                                ? 'bg-[#dbeafe] text-[#1e3a8a]'
                                : 'text-[#374151] hover:bg-[#f3f4f6]'
                        }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => changeLanguage('bn')}
                        className={`block w-full text-left px-3 py-1.5 text-xs sm:text-sm ${
                            language === 'bn'
                                ? 'bg-[#dbeafe] text-[#1e3a8a]'
                                : 'text-[#374151] hover:bg-[#f3f4f6]'
                        }`}
                    >
                        বাংলা (Bengali)
                    </button>
                </div>
            </div>
        )}
    </div>
    </>
  );
};

export default GoogleTranslate;