import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa"; // Importing React Icons

const SearchForm: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Handler to toggle search bar activation
  const handleSearchToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setSearchValue("");
    }
  };

  // Handler to cancel search and close the search bar
  const handleCancel = () => {
    setIsActive(false);
    setSearchValue("");
  };

  // Handler for input value changes
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Handler to close the search bar when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const searchBar = inputRef.current?.closest(".search-bar");
      if (searchBar && !searchBar.contains(event.target as Node)) {
        setIsActive(false);
        setSearchValue("");
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div
        className={`relative flex items-center ${
          isActive ? "w-[300px]" : "w-[60px]"
        } h-[45px] transition-all duration-500 ease-in-out`}
      >
        {/* Input field */}
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder="Search..."
          className={`w-full h-full rounded-full bg-transparent text-white pl-10 text-lg ${
            isActive ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all duration-500 ease-in-out`}
          ref={inputRef}
        />

        {/* Conditional rendering of icons */}
        {isActive ? (
          searchValue ? (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full flex items-center justify-center bg-transparent text-black transition-all duration-500 ease-in-out"
              onClick={handleSearchToggle}
            >
              <FaSearch className="text-white" />
            </button>
          ) : (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full flex items-center justify-center bg-transparent text-black transition-all duration-500 ease-in-out"
              onClick={handleCancel}
            >
              <FaTimes className="text-white" />
            </button>
          )
        ) : (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full flex items-center justify-center bg-transparent text-black transition-all duration-500 ease-in-out"
            onClick={handleSearchToggle}
          >
            <FaSearch className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchForm;