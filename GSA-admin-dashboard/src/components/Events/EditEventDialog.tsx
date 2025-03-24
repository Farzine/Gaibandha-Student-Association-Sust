// EditEventDialog.tsx
import React from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Event, EventFormData, AlertProps } from "./types";
import EventInputForm from "./EventInputForm";
import Alert from "./Alert";
import Image from "next/image";

interface EditEventDialogProps {
  open: boolean;
  event: Event | null;
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  alert: AlertProps | null;
  setAlert: React.Dispatch<React.SetStateAction<AlertProps | null>>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onDeleteImage: (eventId: string, imageId: string) => Promise<void>;
}

const EditEventDialog: React.FC<EditEventDialogProps> = ({
  open,
  event,
  formData,
  setFormData,
  alert,
  setAlert,
  isSubmitting,
  onClose,
  onSubmit,
  onDeleteImage,
}) => {
  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg z-50">
          <div className="flex justify-between items-center pb-3 border-b">
            <h3 className="text-lg font-semibold text-[#4f46e5]">Edit Event</h3>
            <button onClick={onClose} className="text-[#9ca3af] hover:text-[#6b7280]">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {alert && (
            <div className="mt-4">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <div className="mt-4 max-h-[70vh] overflow-y-auto px-1">
            <EventInputForm
              formData={formData}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              onCancel={onClose}
              submitLabel="Update Event"
            />

            {/* Existing Images Section */}
            <div className="mt-8">
              <h4 className="font-semibold text-[#374151] mb-4">Existing Images:</h4>
              
              {event.images.length === 0 ? (
                <p className="text-[#6b7280] italic">No images available</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {event.images.map((img) => (
                    <div 
                      key={img._id} 
                      className="relative group rounded-lg overflow-hidden shadow-md border border-[#e5e7eb] hover:shadow-lg transition-all"
                    >
                      <Image
                        src={img.path}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => img._id && onDeleteImage(event._id, img._id)}
                          className="p-2 bg-[#dc2626] text-white rounded-full hover:bg-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ef4444]"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventDialog;