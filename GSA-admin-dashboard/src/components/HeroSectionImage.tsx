"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

/* MUI Components */
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import CircularProgress from "@mui/material/CircularProgress";

/* Icons */
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ImageIcon from "@mui/icons-material/Image";
import UploadFileIcon from "@mui/icons-material/UploadFile";

/* Custom Loader */
import Loader from "@/components/common/Loader";

/* Custom Alert component */
import Alert from "@/components/Alert";

/* Interface for the image data */
interface HeroImage {
  _id: string;
  path: string;
  public_id: string;
  description?: string;
  title: string;
}

const HeroSectionImage: React.FC = () => {
  // ------------------ State ------------------
  const [images, setImages] = useState<HeroImage[]>([]);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // Loader states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Alert states
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // ------------------ Effects ------------------
  useEffect(() => {
    fetchImages();
  }, []);

  // Create preview when file changes
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

  // ------------------ Handlers ------------------
  // GET images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/heroSectionImage`,
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
    
    if (!title.trim()) {
      showAlertMessage("error", "Title is required!");
      return;
    }
    
    try {
      setUploading(true);

      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", description);
      formData.append("title", title);

      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/heroSectionImage/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showAlertMessage("success", "Hero image uploaded successfully!");
      fetchImages();

      // Reset form
      setFile(null);
      setDescription("");
      setTitle("");
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
      setDeleting(id);
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/heroSectionImage/${id}`,
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
      setDeleting(null);
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
          mb: 5,
          borderRadius: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontWeight: 500,
            mb: 3 
          }}
        >
          <AddPhotoAlternateIcon color="primary" />
          Add New Hero Image
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
                  minHeight: 250,
                  cursor: "pointer",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "rgb(36,48,63)" : "rgba(0,0,0,0.02)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgb(36,48,65)" : "rgba(0,0,0,0.04)",
                  },
                }}
                onClick={() => document.getElementById("hero-image-upload")?.click()}
              >
                <input
                  id="hero-image-upload"
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
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <>
                    <ImageIcon
                      sx={{ fontSize: 64, color: "primary.main", mb: 2, opacity: 0.7 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      Drag and drop an image or click to browse
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Recommended size: 1920×1080px
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
                    required
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                    helperText="Enter a title for the hero image"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={4}
                    placeholder="Enter a brief description for this hero image"
                    helperText="Optional: Add context or description for this image"
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
                        <UploadFileIcon />
                      )
                    }
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      mt: 1,
                      fontWeight: 500,
                      boxShadow: 2
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload Hero Image"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Current Hero Images Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 3
          }}
        >
          <ImageIcon fontSize="small" color="primary" />
          Current Hero Images
          <Typography 
            component="span" 
            variant="body2" 
            sx={{ 
              ml: 2,
              color: (theme) => 
                theme.palette.mode === "light" ? 'text.secondary':"text.primary",
              backgroundColor: (theme) => 
                theme.palette.mode === 'light' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              fontSize: '0.75rem',
            }}
          >
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </Typography>
        </Typography>

        {images.length === 0 ? (
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
            <ImageIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hero images yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Upload your first hero image using the form above.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {images.map((img) => (
              <Grid item xs={12} sm={6} md={4} key={img._id}>
                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: (theme) => theme.shadows[10],
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                      <CardMedia
                        component="img"
                        image={img.path}
                        alt={img.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          m: 1,
                        }}
                      >
                        <IconButton
                          aria-label="delete image"
                          onClick={() => handleDelete(img._id)}
                          disabled={deleting === img._id}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            color: "error.main",
                            "&:hover": {
                              backgroundColor: "error.main",
                              color: "white",
                            },
                            width: 36,
                            height: 36,
                          }}
                        >
                          {deleting === img._id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography 
                        variant="subtitle1" 
                        component="h3"
                        fontWeight={500}
                        gutterBottom
                        noWrap
                      >
                        {img.title}
                      </Typography>
                      {img.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: 1.5,
                          }}
                        >
                          {img.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default HeroSectionImage;