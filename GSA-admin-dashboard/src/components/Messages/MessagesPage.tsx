"use client";
import React, { useState, useEffect } from "react";
import MessageForm from "./MessageForm";
import MessagesList from "./MessagesList";
import axios from "axios";
import Cookies from "js-cookie";
import { MessageType } from "./types";

const MessagesPage: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<MessageType | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const token = Cookies.get("token");

  const handleSubmit = async (formData: FormData) => {
    try {
      if (isEditMode && currentMessage) {
        // Edit message logic
        await axios.put(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/message/update/${currentMessage._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsEditMode(false);
        setCurrentMessage(null);
      } else {
        // Create message logic
        await axios.post(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/message/create`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      // Trigger refresh in MessagesList
      setRefreshTrigger(prev => !prev);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleEdit = (message: MessageType) => {
    setCurrentMessage(message);
    setIsEditMode(true);
    setIsFormVisible(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setCurrentMessage(null);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen dark:bg-[#111827] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#111827] dark:text-white">
              Messages Management
            </h1>
            <button
              onClick={toggleFormVisibility}
              className="flex items-center px-4 py-2 bg-[#e5e7eb] dark:bg-[#374151] text-[#374151] dark:text-[#e5e7eb] rounded-lg hover:bg-[#d1d5db] dark:hover:bg-[#4b5563] transition-all duration-200 text-sm font-medium"
            >
              {isFormVisible ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Hide Form
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Show Form
                </>
              )}
            </button>
          </div>
          <div className="h-1 w-32 bg-primary mt-2 rounded-full"></div>
          <p className="text-[#4b5563] dark:text-[#d1d5db] mt-4">
            {isEditMode ? "Update existing messages or create new ones." : "Create and manage your messages easily."}
          </p>
        </div>

        <div className="space-y-8">
          {isFormVisible && (
            <div className="transition-all duration-300 ease-in-out">
              <MessageForm
                initialData={currentMessage}
                isEditMode={isEditMode}
                onSubmit={handleSubmit}
                onCancel={cancelEdit}
              />
            </div>
          )}

          <MessagesList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;