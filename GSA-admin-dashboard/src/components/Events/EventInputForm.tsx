// EventInputForm.tsx
import React, { useState, ChangeEvent } from "react";
import { Editor } from "primereact/editor";
import { EventFormData } from "./types";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface EventInputFormProps {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

const EventInputForm: React.FC<EventInputFormProps> = ({
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, files: Array.from(e.target.files) });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" encType="multipart/form-data">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#374151]">
            Event Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-[#d1d5db] rounded-md shadow-sm focus:outline-none focus:ring-[#6366f1] focus:border-[#6366f1] text-black"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[#374151]">
            Event Date
          </label>
          <input
            id="date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-[#d1d5db] rounded-md shadow-sm focus:outline-none focus:ring-[#6366f1] focus:border-[#6366f1] text-black"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-[#374151]">
          Event Location
        </label>
        <input
          id="location"
          type="text"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-[#d1d5db] rounded-md shadow-sm focus:outline-none focus:ring-[#6366f1] focus:border-[#6366f1] text-black"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#374151]">
          Event Description
        </label>
        <div className="mt-1">
          <Editor
            value={formData.description}
            onTextChange={(e) => setFormData({ ...formData, description: e.htmlValue || "" })}
            style={{ height: '200px' }}
            className="border border-[#d1d5db] rounded-md overflow-hidden text-black"
          />
        </div>
      </div>
      
      <div className="border-2 border-dashed border-[#d1d5db] rounded-lg p-6 text-center">
        <span>Maximum 10 images per event</span>
        <div className="flex flex-col items-center">
          <PhotoIcon className="h-12 w-12 text-[#9ca3af] mb-3" />
          <div className="flex text-sm text-[#4b5563]">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-[#4f46e5] py-2 px-4 text-white rounded-md font-medium hover:bg-[#4338ca] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#6366f1]"
            >
              <span>Select Images</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          {formData.files.length > 0 && (
            <div className="mt-4">
              <span className="px-3 py-1 text-sm text-[#166534] bg-[#dcfce7] rounded-full">
                {formData.files.length} file(s) selected
              </span>
              <p className="mt-2 text-xs text-[#6b7280]">
                {formData.files.map((file) => file.name).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-[#d1d5db] rounded-md shadow-sm text-sm font-medium text-[#374151] bg-white hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1]"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1] disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
        >
          {isSubmitting ? (
            <div className="flex justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default EventInputForm;