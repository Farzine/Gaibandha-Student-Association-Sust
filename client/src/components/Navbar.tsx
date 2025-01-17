'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShinyButton } from "@/components/ui/shiny-button";
import SearchForm from './Searchbar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPricingDropdownOpen, setIsPricingDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const togglePricingDropdown = () => {
    setIsPricingDropdownOpen(!isPricingDropdownOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-transparent border-b dark:bg-gray-900 shadow-sm">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
          <span className="text-2xl font-semibold dark:text-white">Brand</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex items-center space-x-8 text-gray-900 dark:text-white">
            <li>
              <Link href="/" className="hover:text-blue-600 text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600 text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-600 text-white">
                Services
              </Link>
            </li>
            <li className="relative">
              <button
                className="hover:text-blue-600 text-white"
                onClick={togglePricingDropdown}
              >
                Pricing
              </button>
              {isPricingDropdownOpen && (
                <ul className="absolute top-10 left-0 w-40 bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <li>
                    <Link
                      href="/pricing/basic"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Basic
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing/premium"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Premium
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing/enterprise"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Enterprise
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600 text-white">
                Contact
              </Link>
            </li>
          </ul>
          <div className="relative">
            <SearchForm />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={toggleUserMenu}
              >
                <img
                  src="/docs/images/people/profile-picture-3.jpg"
                  className="w-10 h-10 rounded-full"
                  alt="User Profile"
                />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="px-4 py-3">
                    <span className="block text-sm dark:text-white">Bonnie Green</span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      name@flowbite.com
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <ShinyButton onClick={handleLogin}>
                Sign in
              </ShinyButton>  
            </>
          )}
          <button
            className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <ul className="flex flex-col items-start px-4 py-2 space-y-2 bg-white border-t dark:bg-gray-800 dark:border-gray-700">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-600">
                Services
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-blue-600">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
