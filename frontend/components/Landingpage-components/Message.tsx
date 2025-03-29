"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Main component
const MessagesDisplay = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/message`);
        setMessages(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch messages');
        setLoading(false);
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return <EmptyState />;
  }

  // Organize messages by role
  const vcMessages = messages.filter(m => m.designation === "Vice Chancellor");
  const proVcMessages = messages.filter(m => m.designation === "Pro Vice Chancellor");
  const chiefAdvisorMessages = messages.filter(m => m.designation === "Chief Advisor");
  const presidentMessages = messages.filter(m => m.designation === "President");
  const secretaryMessages = messages.filter(m => m.designation === "General Secretary");
  const otherMessages = messages.filter(m => 
    !["Vice Chancellor", "Pro Vice Chancellor", "Chief Advisor", "President", "General Secretary"].includes(m.designation)
  );

  return (
    <div className="w-full min-h-screen p-4 transition-colors duration-300 dark:bg-[#111827] dark:text-white bg-[#f9fafb] text-[#1f2937]">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        
        {/* Row 1: VC and Pro-VC */}
        {(vcMessages.length > 0 || proVcMessages.length > 0) && (
          <MessageRow>
            {vcMessages.map((message, index) => (
              <MessageCard 
                key={`vc-${index}`} 
                message={message} 
                className="bg-[#eff6ff] dark:bg-[#1E3A8A33] border-[#bfdbfe] dark:border-[#1e40af]"
                highlightColor="blue"
              />
            ))}
            {proVcMessages.map((message, index) => (
              <MessageCard 
                key={`provc-${index}`} 
                message={message} 
                className="bg-[#eff6ff] dark:bg-[#1E3A8A33] border-[#bfdbfe] dark:border-[#1e40af]"
                highlightColor="blue"
              />
            ))}
          </MessageRow>
        )}
        
        {/* Row 2: Chief Advisor */}
        {chiefAdvisorMessages.length > 0 && (
          <div className="flex justify-center w-full mb-8">
            <div className="max-w-2xl w-full">
              {chiefAdvisorMessages.map((message, index) => (
            <MessageCard 
              key={`advisor-${index}`} 
              message={message} 
              className="bg-[#EFF6FFB3] dark:bg-[#1E3A8A1A] border-[#dbeafe] dark:border-[#1e3a8a]"
              highlightColor="blue"
            />
              ))}
            </div>
          </div>
        )}
        
        {/* Row 3: President and Secretary */}
        {(presidentMessages.length > 0 || secretaryMessages.length > 0) && (
          <MessageRow>
            {presidentMessages.map((message, index) => (
              <MessageCard 
                key={`president-${index}`} 
                message={message} 
                className="bg-white dark:bg-[#1f2937] border-[#e5e7eb] dark:border-[#374151]"
                highlightColor="gray"
              />
            ))}
            {secretaryMessages.map((message, index) => (
              <MessageCard 
                key={`secretary-${index}`} 
                message={message} 
                className="bg-white dark:bg-[#1f2937] border-[#e5e7eb] dark:border-[#374151]"
                highlightColor="gray"
              />
            ))}
          </MessageRow>
        )}
        
        {/* Other Messages */}
        {otherMessages.length > 0 && (
          <>
            <h2 className="text-xl font-bold mt-10 mb-4 text-[#1e40af] dark:text-[#93c5fd]">Other Leadership Messages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherMessages.map((message, index) => (
                <MessageCard 
                  key={`other-${index}`} 
                  message={message} 
                  className="bg-white dark:bg-[#1f2937] border-[#e5e7eb] dark:border-[#374151]"
                  highlightColor="gray"
                  compact={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Component for page header
const PageHeader = () => (
    <div className="mb-12 w-full">
        <div className="mb-6 flex flex-col items-center justify-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-4">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-10 w-10 md:h-10 md:w-10 text-primary dark:text-primary/90 mb-2 md:mb-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                    />
                </svg>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-tight">
                    <span className="relative inline-block bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent px-1">
                        Messages
                        <span className="absolute -bottom-1.5 left-0 h-0.5 w-full transform scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"></span>
                    </span>
                </h2>
            </div>
            <div className="mx-auto max-w-3xl px-4 md:px-8">
                <p className="text-center text-sm sm:text-base md:text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db] max-w-prose mx-auto">
                    <span className="relative inline-block">
                        <span className="relative font-medium">Words of Insight and Vision</span>
                    </span> from our distinguished leadership — guiding the Gaibandha Student Association toward excellence and community impact.
                </p>
                <div className="flex justify-center mt-3">
                    <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary-light rounded-full"></div>
                </div>
            </div>
        </div>
    </div>
);

// Component for message rows
const MessageRow = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {children}
  </div>
);

// Component for individual message cards
const MessageCard = ({ message, className, highlightColor, compact = false }) => {
  const highlightStyles = {
    blue: "border-l-4 border-l-[#2563eb] dark:border-l-[#60a5fa]",
    gray: "border-l-4 border-l-[#6b7280] dark:border-l-[#9ca3af]"
  };

  return (
    <div className={`rounded-xl shadow-md overflow-hidden border transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${className} ${highlightStyles[highlightColor]}`}>
        <div className="p-6">
            <div className={`flex ${compact ? "flex-row items-center" : "flex-col md:flex-row"} gap-5`}>
                <div className="flex-shrink-0">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] rounded-full opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img 
                            src={message.path || "/placeholder-profile.jpg"} 
                            alt={message.name} 
                            className={`${compact ? "w-16 h-16" : "w-20 h-20 md:w-24 md:h-24"} relative object-cover rounded-full border-2 border-white dark:border-[#1f2937] shadow-md`}
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder-profile.jpg";
                            }}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#2563eb] to-[#4338ca] dark:from-[#3b82f6] dark:to-[#6366f1] rounded-full shadow-lg flex items-center justify-center text-white font-medium z-10 transform transition-transform duration-300 group-hover:scale-110">
                            <div className={`${compact ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm"} flex items-center justify-center`}>
                                {message.designation.split(' ')[0].charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-lg md:text-xl bg-gradient-to-r from-[#1d4ed8] to-[#4338ca] dark:from-[#60a5fa] dark:to-[#818cf8] bg-clip-text text-transparent">{message.name}</h3>
                        <p className="text-sm font-medium text-[#4b5563] dark:text-[#d1d5db] mb-3 italic">
                            {message.designation}
                        </p>
                        <div className="relative">
                            <div className="absolute top-0 left-0 w-12 h-8 opacity-10 -translate-x-3 -translate-y-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-full h-full text-[#2563eb] dark:text-[#60a5fa]" viewBox="0 0 32 32">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                                </svg>
                            </div>
                            <div 
                                className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-blue text-[#374151] dark:text-[#e5e7eb] pl-1"
                                dangerouslySetInnerHTML={{
                                    __html: message.message.replace(/\n/g, '<br />')
                                }}
                            />
                            <div className="absolute bottom-0 right-0 w-12 h-8 opacity-10 translate-x-3 translate-y-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-full h-full text-[#2563eb] dark:text-[#60a5fa]" viewBox="0 0 32 32">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// Component for loading state
const LoadingState = () => (
  <div className="w-full min-h-screen flex justify-center items-center dark:bg-[#111827] dark:text-white bg-[#f9fafb] text-[#1f2937]">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#bfdbfe] border-t-[#2563eb] rounded-full animate-spin mb-4"></div>
      <div className="text-xl">Loading messages...</div>
    </div>
  </div>
);

// Component for error state
const ErrorState = ({ error }) => (
  <div className="w-full min-h-screen flex justify-center items-center dark:bg-[#111827] dark:text-white bg-[#f9fafb] text-[#1f2937]">
    <div className="text-xl text-[#ef4444] p-6 bg-[#fef2f2] dark:bg-[#7F1D1D33] rounded-lg shadow-md border border-[#fecaca] dark:border-[#991b1b]">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  </div>
);

// Component for empty state
const EmptyState = () => (
  <div className="w-full min-h-screen flex justify-center items-center dark:bg-[#111827] dark:text-white bg-[#f9fafb] text-[#1f2937]">
    <div className="text-xl p-6 bg-[#f9fafb] dark:bg-[#1f2937] rounded-lg shadow-md border border-[#e5e7eb] dark:border-[#374151]">
      <div className="flex flex-col items-center gap-3 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <span>No messages found.</span>
        <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">Check back later for updates from leadership.</p>
      </div>
    </div>
  </div>
);

export default MessagesDisplay;