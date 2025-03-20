"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

/* MUI Components */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";

/* Custom Loader */
import Loader from "@/components/common/Loader";

import Alert from "@/components/Alert";

interface GalleryImage {
  _id: string;
  path: string;
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
  const [preview, setPreview] = useState<string | null>(null);

  // Loader states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  // Alert states
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Filter states
  const [filterTag, setFilterTag] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");

  useEffect(() => {
    fetchImages();
  }, []);

  // Create a preview when file changes
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Free memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/gallery/all`,
      );
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
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showAlertMessage("success", "Image uploaded successfully!");
      fetchImages();

      // Reset form
      setFile(null);
      setDescription("");
      setTag("Others");
      setYear("2025");
      setPreview(null);
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

  // Filter images based on tag and year
  const filteredImages = images.filter((img) => {
    return (
      (!filterTag || img.tag === filterTag) &&
      (!filterYear || img.year.toString() === filterYear)
    );
  });

  // Get unique years for filter dropdown
  const uniqueYears = Array.from(
    new Set(images.map((img) => img.year.toString()))
  ).sort((a, b) => parseInt(b) - parseInt(a));

  // ------------------ Render ------------------
  if (loading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Alert component */}
      {showAlert && alertMessage && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={handleCloseAlert}
        />
      )}

      {/* Upload Form */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "medium", mb: 3 }}
        >
          Upload New Image
        </Typography>

        <form onSubmit={handleUpload}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 200,
                  cursor: "pointer",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                  },
                }}
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  style={{ display: "none" }}
                />
                {preview ? (
                  <Box
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <>
                    <CloudUploadIcon
                      sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                    />
                    <Typography variant="body1" color="textSecondary">
                      Drag and drop or click to upload
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Supports: JPG, PNG, GIF
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter image description"
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    variant="outlined"
                    size="medium"
                  >
                    {TAG_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    variant="outlined"
                    size="medium"
                    InputProps={{ inputProps: { min: 2000, max: 2030 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={uploading || !file}
                    startIcon={
                      uploading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CloudUploadIcon />
                      )
                    }
                    sx={{ mt: 1 }}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Filters */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ mr: 1 }}>
          Filters:
        </Typography>
        
        <TextField
          select
          label="Tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Tags</MenuItem>
          {TAG_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          select
          label="Year"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All Years</MenuItem>
          {uniqueYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
        
        {(filterTag || filterYear) && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setFilterTag("");
              setFilterYear("");
            }}
          >
            Clear Filters
          </Button>
        )}
        
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          <Typography variant="body2" color="textSecondary">
            Showing {filteredImages.length} of {images.length} images
          </Typography>
        </Box>
      </Paper>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <Grid container spacing={3}>
          {filteredImages.map((img) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={img._id}>
              <Fade in={true} timeout={500}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: (theme) => theme.shadows[8],
                    },
                    overflow: "hidden",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ position: "relative", paddingTop: "66.67%" }}>
                    <CardMedia
                      component="img"
                      image={img.path}
                      alt={img.description || "Gallery Image"}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Chip
                      label={img.tag}
                      size="small"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontSize: "0.75rem",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(img._id)}
                      disabled={deletingImageId === img._id}
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                          color: "error.main",
                        },
                      }}
                    >
                      {deletingImageId === img._id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="div"
                      >
                        {img.year}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {img.description || "No description"}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No images found matching your filters
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Try adjusting your filter criteria or upload new images.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default GalleryPage;