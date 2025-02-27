"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";

/* Material UI Components */
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  Chip,
  Container,
  MobileStepper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import SwipeableViews from "react-swipeable-views";

/* Custom Alert component (for success/error messages) */
import Alert from "@/components/Alert";

interface EventType {
  _id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  images: { _id?: string; path: string; public_id: string }[];
  createdAt: string;
}

const AdminEvents: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [tab, setTab] = useState(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* Image Carousel States */
  const [activeImageSteps, setActiveImageSteps] = useState<{
    [key: string]: number;
  }>({});

  /* Create Event Form States */
  const [createForm, setCreateForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    files: [] as File[],
  });
  const [creating, setCreating] = useState(false);

  /* Edit Event States */
  const [editEvent, setEditEvent] = useState<EventType | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    files: [] as File[],
  });
  const [editing, setEditing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  /* Delete Image States */
  const [imageDeleteAlert, setImageDeleteAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

  // Handle image carousel navigation
  const handleImageStepChange = (eventId: string, step: number) => {
    setActiveImageSteps((prev) => ({ ...prev, [eventId]: step }));
  };

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/adminTask/event`);
      if (res.data.success) {
        const fetchedEvents = res.data.data;
        // Initialize carousel steps for each event
        const initialActiveSteps: { [key: string]: number } = {};
        fetchedEvents.forEach((event: EventType) => {
          initialActiveSteps[event._id] = 0;
        });
        setActiveImageSteps(initialActiveSteps);
        setEvents(fetchedEvents);
      } else {
        setAlert({
          type: "error",
          message: res.data.message || "Failed to fetch events",
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error fetching events",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle tab changes between Event List and Create Event
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // Handle file selection (for create form)
  const handleCreateFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCreateForm({ ...createForm, files: Array.from(e.target.files) });
    }
  };

  // Handle file selection (for edit form)
  const handleEditFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditForm({ ...editForm, files: Array.from(e.target.files) });
    }
  };

  // Create a new event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !createForm.title ||
      !createForm.date ||
      !createForm.location ||
      !createForm.description
    ) {
      setAlert({ type: "error", message: "Please fill all required fields" });
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
        },
      );
      if (res.data.success) {
        setAlert({
          type: "success",
          message: res.data.message || "Event created successfully",
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
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error creating event",
      });
      console.error(error);
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
        });
        setEvents((prev) => prev.filter((event) => event._id !== id));
      } else {
        setAlert({
          type: "error",
          message: res.data.message || "Failed to delete event",
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error deleting event",
      });
    }
  };

  // Open the edit dialog and pre-fill the form with event data
  const openEditDialog = (event: EventType) => {
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
        },
      );
      if (res.data.success) {
        setAlert({
          type: "success",
          message: res.data.message || "Event updated successfully",
        });
        setEditDialogOpen(false);
        fetchEvents();
      } else {
        setAlert({
          type: "error",
          message: res.data.message || "Failed to update event",
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error updating event",
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
        },
      );
      if (res.data.success) {
        setImageDeleteAlert({
          type: "success",
          message: res.data.message || "Image deleted successfully",
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
        });
      }
    } catch (error: any) {
      setImageDeleteAlert({
        type: "error",
        message: error.response?.data?.message || "Error deleting image",
      });
    }
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

  // Truncate description text for card display
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="500"
            color="primary" //Event Management Dashboard
          >
            Event Management Dashboard
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ mb: 3 }}
          >
            <Tab label="Event List" />
            <Tab label="Create Event" />
          </Tabs>

          {/* Event List Tab */}
          {tab === 0 && (
            <Box>
              {loading ? (
                <Box display="flex" justifyContent="center" p={5}>
                  <CircularProgress />
                </Box>
              ) : events.length === 0 ? (
                <Box textAlign="center" p={5}>
                  <Typography variant="h6" color="textSecondary">
                    No events found. Create your first event.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => setTab(1)}
                  >
                    Create Event
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                      >
                        {/* Image Carousel */}
                        <Box sx={{ position: "relative", height: 200 }}>
                          {event.images && event.images.length > 0 ? (
                            <>
                              <SwipeableViews
                                axis={
                                  theme.direction === "rtl" ? "x-reverse" : "x"
                                }
                                index={activeImageSteps[event._id] || 0}
                                onChangeIndex={(step) =>
                                  handleImageStepChange(event._id, step)
                                }
                                enableMouseEvents
                              >
                                {event.images.map((img, index) => (
                                  <div key={index}>
                                    <Box
                                      component="img"
                                      sx={{
                                        height: 200,
                                        display: "block",
                                        overflow: "hidden",
                                        width: "100%",
                                        objectFit: "cover",
                                      }}
                                      src={img.path}
                                      alt={`${event.title} - image ${index + 1}`}
                                    />
                                  </div>
                                ))}
                              </SwipeableViews>
                              {event.images.length > 1 && (
                                <MobileStepper
                                  steps={event.images.length}
                                  position="static"
                                  activeStep={activeImageSteps[event._id] || 0}
                                  sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    width: "100%",
                                    background: "rgba(255,255,255,0.7)",
                                  }}
                                  nextButton={
                                    <Button
                                      size="small"
                                      onClick={() =>
                                        handleImageStepChange(
                                          event._id,
                                          (activeImageSteps[event._id] || 0) +
                                            1,
                                        )
                                      }
                                      disabled={
                                        (activeImageSteps[event._id] || 0) ===
                                        event.images.length - 1
                                      }
                                    >
                                      {theme.direction === "rtl" ? (
                                        <KeyboardArrowLeft />
                                      ) : (
                                        <KeyboardArrowRight />
                                      )}
                                    </Button>
                                  }
                                  backButton={
                                    <Button
                                      size="small"
                                      onClick={() =>
                                        handleImageStepChange(
                                          event._id,
                                          (activeImageSteps[event._id] || 0) -
                                            1,
                                        )
                                      }
                                      disabled={
                                        (activeImageSteps[event._id] || 0) === 0
                                      }
                                    >
                                      {theme.direction === "rtl" ? (
                                        <KeyboardArrowRight />
                                      ) : (
                                        <KeyboardArrowLeft />
                                      )}
                                    </Button>
                                  }
                                />
                              )}
                            </>
                          ) : (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              height={200}
                              bgcolor="grey.100"
                            >
                              <ImageIcon
                                sx={{ fontSize: 60, color: "grey.400" }}
                              />
                            </Box>
                          )}
                        </Box>

                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom noWrap>
                            {event.title}
                          </Typography>

                          <Box display="flex" alignItems="center" mb={1}>
                            <CalendarTodayIcon
                              fontSize="small"
                              color="action"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" color="textSecondary">
                              {formatDate(event.date)}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" mb={2}>
                            <LocationOnIcon
                              fontSize="small"
                              color="action"
                              sx={{ mr: 1 }}
                            />
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              noWrap
                            >
                              {event.location}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              mb: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {event.description}
                          </Typography>

                          <Chip
                            size="small"
                            label={`${event.images ? event.images.length : 0} Images`}
                            color="primary"
                            variant="outlined"
                          />
                        </CardContent>

                        <Divider />

                        <CardActions
                          sx={{ justifyContent: "space-between", p: 1.5 }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => openEditDialog(event)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteEvent(event._id)}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Create Event Tab */}
          {tab === 1 && (
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Create New Event
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handleCreateEvent} encType="multipart/form-data">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Event Title"
                      variant="outlined"
                      fullWidth
                      required
                      value={createForm.title}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, title: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Event Date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={createForm.date}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, date: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Event Location"
                      variant="outlined"
                      fullWidth
                      required
                      value={createForm.location}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          location: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Event Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      required
                      value={createForm.description}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: "1px dashed",
                        borderColor: "grey.300",
                        borderRadius: 1,
                        p: 3,
                        textAlign: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<ImageIcon />}
                      >
                        Select Images
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handleCreateFileChange}
                        />
                      </Button>
                      {createForm.files.length > 0 && (
                        <Box mt={2}>
                          <Chip
                            label={`${createForm.files.length} file(s) selected`}
                            color="success"
                            variant="outlined"
                          />
                          <Typography
                            variant="caption"
                            display="block"
                            mt={1}
                            color="textSecondary"
                          >
                            {createForm.files
                              .map((file) => file.name)
                              .join(", ")}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between">
                      <Button variant="outlined" onClick={() => setTab(0)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={creating}
                        sx={{ minWidth: 120 }}
                      >
                        {creating ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Create Event"
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          )}
        </Paper>
      </Box>

      {/* Edit Event Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Typography variant="h6" color="primary">
            Edit Event
          </Typography>
          {imageDeleteAlert && (
            <Box mt={2}>
              <Alert
                type={imageDeleteAlert.type}
                message={imageDeleteAlert.message}
                onClose={() => setImageDeleteAlert(null)}
              />
            </Box>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {editEvent && (
            <form
              id="edit-event-form"
              onSubmit={handleUpdateEvent}
              encType="multipart/form-data"
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Event Title"
                    variant="outlined"
                    fullWidth
                    required
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Event Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Event Location"
                    variant="outlined"
                    fullWidth
                    required
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Event Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    required
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: "1px dashed",
                      borderColor: "grey.300",
                      borderRadius: 1,
                      p: 3,
                      textAlign: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<ImageIcon />}
                    >
                      Upload New Images
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleEditFileChange}
                      />
                    </Button>
                    {editForm.files.length > 0 && (
                      <Box mt={2}>
                        <Chip
                          label={`${editForm.files.length} file(s) selected`}
                          color="success"
                          variant="outlined"
                        />
                        <Typography
                          variant="caption"
                          display="block"
                          mt={1}
                          color="textSecondary"
                        >
                          {editForm.files.map((file) => file.name).join(", ")}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: "bold" }}
                  >
                    Existing Images:
                  </Typography>
                  {editEvent.images.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      No images available
                    </Typography>
                  ) : (
                    <Grid item xs={12}>
                      {editEvent.images.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                          No images available.
                        </Typography>
                      ) : (
                        <Grid container spacing={2}>
                          {editEvent.images.map((img) => (
                            <Grid item xs={12} sm={6} md={4} key={img._id}>
                              <Card
                                sx={{
                                  width: 250,
                                  height: 250,
                                  borderRadius: 2,
                                  boxShadow: 5,
                                  transition: "transform 0.3s, box-shadow 0.3s",
                                  "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: 6,
                                  },
                                  display: "flex",
                                  padding: 1,
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  image={img.path}
                                  alt={editForm.title}
                                  sx={{
                                    width: "100%",
                                    height: 200,
                                    objectFit: "cover",
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                  }}
                                />
                                <CardActions
                                  sx={{
                                    justifyContent: "center",
                                    p: 1,
                                  }}
                                >
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() =>
                                      handleDeleteEventImage(
                                        editEvent._id,
                                        img._id!,
                                      )
                                    }
                                  >
                                    Delete
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-event-form"
            variant="contained"
            color="primary"
            disabled={editing}
            sx={{ minWidth: 120 }}
          >
            {editing ? <CircularProgress size={24} /> : "Update Event"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminEvents;
