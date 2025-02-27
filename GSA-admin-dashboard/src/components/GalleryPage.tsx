"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

/* MUI Components */
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";

/* Custom Loader (full-screen or center spinner) */
import Loader from "@/components/common/Loader";

/* Your custom Alert component for success/error handling */
import Alert from "@/components/Alert";

/* 
  The shape of your images in the DB (Mongoose schema).
  Adjust if needed:
*/
interface GalleryImage {
  _id: string;
  path: string; // The actual image URL (cloudinary or local)
  public_id: string;
  description?: string;
  tag: string;
  year: number;
}

const TAG_OPTIONS = [
  "Newcomer's welcome",
  "Relief",
  "Party",
  "Programs",
  "Others",
];

const GalleryPage: React.FC = () => {
  // ------------------ State ------------------
  const [images, setImages] = useState<GalleryImage[]>([]);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Others");
  const [year, setYear] = useState<string>("2025");

  // Loader states
  const [loading, setLoading] = useState(false); // For fetch & delete
  const [uploading, setUploading] = useState(false); // For upload button
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null); // For individual delete button

  // Alert states
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // ------------------ Effects ------------------
  // Fetch images on mount
  useEffect(() => {
    fetchImages();
  }, []);

  // ------------------ Handlers ------------------
  // GET images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/gallery`,
      );
      // Make sure your backend returns: { success: true, data: [...], message: '' }
      // Then setImages(res.data.data)
      setImages(res.data.data);
    } catch (err: any) {
      showAlertMessage("error", "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  // POST /upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showAlertMessage("error", "Please choose a file first!");
      return;
    }
    try {
      setUploading(true);

      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", description);
      formData.append("tag", tag);
      formData.append("year", year);

      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/gallery/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // remove if not needed
          },
        },
      );

      showAlertMessage("success", "Image uploaded successfully!");
      // re-fetch to show new image
      fetchImages();

      // Reset form
      setFile(null);
      setDescription("");
      setTag("Others");
      setYear("2025");
    } catch (err: any) {
      showAlertMessage(
        "error",
        err.response?.data?.message || "Failed to upload image",
      );
    } finally {
      setUploading(false);
    }
  };

  // DELETE /:id
  const handleDelete = async (id: string) => {
    try {
      setDeletingImageId(id);
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/gallery/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      showAlertMessage("success", "Image deleted successfully!");
      // Remove from local state or re-fetch
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err: any) {
      showAlertMessage(
        "error",
        err.response?.data?.message || "Failed to delete image",
      );
    } finally {
      setDeletingImageId(null);
    }
  };

  // Simple helper to show an alert
  const showAlertMessage = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  // Close the alert
  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  // ------------------ Render ------------------
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-4">
      {/* Alert - only render if showAlert is true */}
      {showAlert && alertMessage && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={handleCloseAlert}
        />
      )}

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h3 className="mb-4 text-lg font-medium text-black dark:text-white">
          File upload
        </h3>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Attach file
          </label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Tag
          </label>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full rounded-md border border-stroke p-3 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            {TAG_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-md border border-stroke p-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="disabled:bg-gray-400 disabled:hover:bg-gray-400 inline-flex items-center gap-2 rounded bg-primary px-5 py-2 font-medium text-white transition-colors hover:bg-opacity-90"
        >
          {/* If uploading, show spinner or text; otherwise show normal text */}
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            "Upload Image"
          )}
        </button>
      </form>

      {/* Gallery Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((img) => (
          <Card
            key={img._id}
            sx={{ maxWidth: 345, position: "relative" }}
            className="shadow-md"
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="180"
                image={img.path}
                alt={img.description || "Gallery Image"}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {img.tag} - {img.year}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {img.description || "No description"}
                </Typography>
              </CardContent>
            </CardActionArea>

            {/* Delete Button */}
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <button
                onClick={() => handleDelete(img._id)}
                disabled={deletingImageId === img._id}
                className="inline-flex items-center justify-center bg-meta-1 px-2 py-2 text-center font-medium text-white hover:bg-opacity-80 lg:px-2 lg:py-2 xl:px-2 xl:py-2"
              >
                {deletingImageId === img._id ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
