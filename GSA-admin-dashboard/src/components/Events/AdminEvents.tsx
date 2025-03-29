"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Event, EventFormData, AlertProps } from "./types";
import Alert from "./Alert";
import EventList from "./EventList";
import EventInputForm from "./EventInputForm";
import EditEventDialog from "./EditEventDialog";

const AdminEvents: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  // Create Event Form States
  const [createForm, setCreateForm] = useState<EventFormData>({
    title: "",
    date: "",
    location: "",
    description: "",
    files: [],
  });
  const [creating, setCreating] = useState(false);

  // Edit Event States
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [editForm, setEditForm] = useState<EventFormData>({
    title: "",
    date: "",
    location: "",
    description: "",
    files: [],
  });
  const [editing, setEditing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imageDeleteAlert, setImageDeleteAlert] = useState<AlertProps | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/adminTask/event`);
      if (res.data.success) {
        setEvents(res.data.data);
      } else {
        setAlert({
          type: "error",
          message: res.data.message || "Failed to fetch events",
          onClose: () => setAlert(null),
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error fetching events",
        onClose: () => setAlert(null),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Create a new event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !createForm.title ||
      !createForm.date ||
      !createForm.location ||
      !createForm.description
    ) {
      setAlert({ 
        type: "error", 
        message: "Please fill all required fields",
        onClose: () => setAlert(null),
      });
      return;
    }
    
    try {
      setCreating(true);
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("title", createForm.title);
      formData.append("date", createForm.date);
      formData.append("location", createForm.location);
      formData.append("description", createForm.description);
      
      createForm.files.forEach((file) => {
        formData.append("images", file);
      });
      
      const res = await axios.post(
        `${baseUrl}/adminTask/event/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.data.success) {
        setAlert({
          type: "success",
          message: res.data.message || "Event created successfully",
          onClose: () => setAlert(null),
        });
        setCreateForm({
          title: "",
          date: "",
          location: "",
          description: "",
          files: [],
        });
        fetchEvents();
        // Switch to event list tab after successful creation
        setTab(0);
      } else {
        setAlert({
          type: "error",
          message: res.data.message || "Failed to create event",
          onClose: () => setAlert(null),
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error creating event",
        onClose: () => setAlert(null),
      });
    } finally {
      setCreating(false);
    }
  };

  // Delete an event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      const token = Cookies.get("token");
      const res = await axios.delete(`${baseUrl}/adminTask/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        setAlert({
          type: "success",
          message: res.data.message || "Event deleted successfully",
          onClose: () => setAlert(null),
        });
        setEvents((prev) => prev.filter((event) => event._id !== id));
      } else {
        setAlert({
          type: "error",
          message: res.data.message || "Failed to delete event",
          onClose: () => setAlert(null),
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error deleting event",
        onClose: () => setAlert(null),
      });
    }
  };

  // Open the edit dialog
  const openEditDialog = (event: Event) => {
    setEditEvent(event);
    setEditForm({
      title: event.title,
      date: event.date.split("T")[0], // Format date for the input
      location: event.location,
      description: event.description,
      files: [],
    });
    setEditDialogOpen(true);
  };

  // Update an event
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEvent) return;
    
    try {
      setEditing(true);
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("date", editForm.date);
      formData.append("location", editForm.location);
      formData.append("description", editForm.description);
      
      editForm.files.forEach((file) => {
        formData.append("images", file);
      });
      
      const res = await axios.put(
        `${baseUrl}/adminTask/event/${editEvent._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.data.success) {
        setAlert({
          type: "success",
          message: res.data.message || "Event updated successfully",
          onClose: () => setAlert(null),
        });
        setEditDialogOpen(false);
        fetchEvents();
      } else {
        setAlert({
          type: "error",
          message: res.data.message || "Failed to update event",
          onClose: () => setAlert(null),
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error updating event",
        onClose: () => setAlert(null),
      });
    } finally {
      setEditing(false);
    }
  };

  // Delete a specific event image
  const handleDeleteEventImage = async (eventId: string, imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      const token = Cookies.get("token");
      const res = await axios.delete(
        `${baseUrl}/adminTask/event/${eventId}/image/${imageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (res.data.success) {
        setImageDeleteAlert({
          type: "success",
          message: res.data.message || "Image deleted successfully",
          onClose: () => setImageDeleteAlert(null),
        });
        
        if (editEvent && editEvent._id === eventId) {
          setEditEvent({
            ...editEvent,
            images: editEvent.images.filter((img) => img._id !== imageId),
          });
        }
        
        fetchEvents();
      } else {
        setImageDeleteAlert({
          type: "error",
          message: res.data.message || "Failed to delete image",
          onClose: () => setImageDeleteAlert(null),
        });
      }
    } catch (error: any) {
      setImageDeleteAlert({
        type: "error",
        message: error.response?.data?.message || "Error deleting image",
        onClose: () => setImageDeleteAlert(null),
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="border-b border-[#e5e7eb] mb-6">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setTab(0)}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              tab === 0
                ? "border-[#6366f1] text-[#4f46e5]"
                : "border-transparent text-[#6b7280] hover:text-[#374151] hover:border-[#d1d5db]"
            }`}
          >
            Events List
          </button>
          <button
            onClick={() => setTab(1)}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              tab === 1
                ? "border-[#6366f1] text-[#4f46e5]"
                : "border-transparent text-[#6b7280] hover:text-[#374151] hover:border-[#d1d5db]"
            }`}
          >
            Create New Event
          </button>
        </nav>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Event List Tab */}
      {tab === 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#1f2937]">Events</h2>
            <button
              onClick={() => setTab(1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1]"
            >
              Create New Event
            </button>
          </div>
          
          <EventList
            events={events}
            loading={loading}
            onEditEvent={openEditDialog}
            onDeleteEvent={handleDeleteEvent}
            onCreateNewClick={() => setTab(1)}
          />
        </div>
      )}

      {/* Create Event Tab */}
      {tab === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-[#1f2937] mb-6">
            Create New Event
          </h2>
          
          <EventInputForm
            formData={createForm}
            setFormData={setCreateForm}
            isSubmitting={creating}
            onSubmit={handleCreateEvent}
            onCancel={() => setTab(0)}
            submitLabel="Create Event"
          />
        </div>
      )}

      {/* Edit Event Dialog */}
      <EditEventDialog
        open={editDialogOpen}
        event={editEvent}
        formData={editForm}
        setFormData={setEditForm}
        alert={imageDeleteAlert}
        setAlert={setImageDeleteAlert}
        isSubmitting={editing}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdateEvent}
        onDeleteImage={handleDeleteEventImage}
      />
    </div>
  );
};

export default AdminEvents;