// EventList.tsx
import React, { useState } from "react";
import { CalendarIcon, MapPinIcon, PhotoIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Event } from "./types";

interface EventListProps {
  events: Event[];
  loading: boolean;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
  onCreateNewClick: () => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  loading,
  onEditEvent,
  onDeleteEvent,
  onCreateNewClick,
}) => {
  // Image carousel state
  const [activeImageSteps, setActiveImageSteps] = useState<{
    [key: string]: number;
  }>({});

  // Handle image carousel navigation
  const handleImageStepChange = (eventId: string, step: number) => {
    setActiveImageSteps((prev) => ({ ...prev, [eventId]: step }));
  };

  // Format date string to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f46e5]"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-[#6b7280] mb-4">No events found. Create your first event.</h3>
        <button
          onClick={onCreateNewClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1]"
        >
          Create Event
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event._id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-[#e5e7eb] transition-all hover:shadow-lg hover:-translate-y-1"
        >
          {/* Image carousel */}
          <div className="relative h-48">
            {event.images && event.images.length > 0 ? (
              <div className="relative w-full h-full">
                {event.images.map((img, index) => (
                  <div
                    key={img._id || index}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
                      (activeImageSteps[event._id] || 0) === index
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={img.path}
                      alt={`${event.title} - image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {event.images.length > 1 && (
                  <div className="absolute bottom-0 inset-x-0 flex justify-between items-center p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <button
                      className="p-1 rounded-full bg-white/70 text-[#1f2937] hover:bg-white"
                      onClick={() =>
                        handleImageStepChange(
                          event._id,
                          (activeImageSteps[event._id] || 0) === 0
                            ? event.images.length - 1
                            : (activeImageSteps[event._id] || 0) - 1
                        )
                      }
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>

                    <div className="text-xs font-medium text-white">
                      {(activeImageSteps[event._id] || 0) + 1} / {event.images.length}
                    </div>

                    <button
                      className="p-1 rounded-full bg-white/70 text-[#1f2937] hover:bg-white"
                      onClick={() =>
                        handleImageStepChange(
                          event._id,
                          (activeImageSteps[event._id] || 0) === event.images.length - 1
                            ? 0
                            : (activeImageSteps[event._id] || 0) + 1
                        )
                      }
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-[#f3f4f6]">
                <PhotoIcon className="h-16 w-16 text-[#9ca3af]" />
              </div>
            )}
          </div>

          {/* Event content */}
          <div className="p-4 flex-grow">
            <h3 className="text-lg font-semibold text-[#111827] mb-2 truncate">
              {event.title}
            </h3>
            
            <div className="flex items-center mb-2 text-[#4b5563]">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center mb-3 text-[#4b5563]">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span className="text-sm truncate">{event.location}</span>
            </div>
            
            <div 
              className="text-sm text-[#4b5563] mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
            
            <div className="inline-block px-2 py-1 text-xs font-medium bg-[#e0e7ff] text-[#3730a3] rounded-full">
              {event.images ? event.images.length : 0} Images
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-4 py-3 bg-[#f9fafb] border-t border-[#e5e7eb] flex justify-between">
            <button
              className="inline-flex items-center px-3 py-1.5 border border-[#d1d5db] text-sm font-medium rounded text-[#374151] bg-white hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1]"
              onClick={() => onEditEvent(event)}
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
            
            <button
              className="inline-flex items-center px-3 py-1.5 border border-[#fca5a5] text-sm font-medium rounded text-[#b91c1c] bg-white hover:bg-[#fef2f2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ef4444]"
              onClick={() => onDeleteEvent(event._id)}
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;