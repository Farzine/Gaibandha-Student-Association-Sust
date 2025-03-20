"use client";
import Profile from "@/components/Profile";
import Alert from "@/components/Alert";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Skeleton,
  Grid,
  Card,
  CardContent,
  Badge,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";

/** The extended User interface */
interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  session: string;
  bloodGroup?: string;
  presentAddress?: string;
  permanentAddress?: string;
  profession?: string;
  facebookId?: string;
  linkedinId?: string;
  about?: string;
  religiousStatus: string;
  profilePic?: string;
  schoolName?: string;
  collegeName?: string;
  member?: boolean;
  alumni?: boolean;
  phone?: string;
  designation?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Response shape from categorizeMember API */
interface CategorizedMembers {
  committee: User[];
  advisors: User[];
  alumni: User[];
  generalMembers: User[];
}

/** Possible designations */
const DESIGNATION_OPTIONS = [
  "President",
  "Senior Vice President",
  "Vice-President",
  "General Secretary",
  "Joint General Secretary",
  "Assistant General Secretary",
  "Treasurer",
  "Assistant Treasurer",
  "Organizing Secretary",
  "Assistant Organizing Secretary",
  "Office Secretary",
  "Assistant Office Secretary",
  "Women's Affairs Secretary",
  "Assistant Women's Affairs Secretary",
  "Sports Secretary",
  "Assistant Sports Secretary",
  "Publication Secretary",
  "Assistant Publication Secretary",
  "IT Secretary",
  "Assistant IT Secretary",
  "Cultural Secretary",
  "Assistant Cultural Secretary",
  "Advisor",
  "Member",
];

// Category Tab Interface
interface CategoryTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const CategorizedMembersPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // ------------- State -------------
  const [members, setMembers] = useState<CategorizedMembers>({
    committee: [],
    advisors: [],
    alumni: [],
    generalMembers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("committee");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // For success/error alerts
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Category tabs
  const categoryTabs: CategoryTab[] = [
    { id: "committee", label: "Committee Members", icon: <GroupsIcon /> },
    { id: "advisors", label: "Advisors", icon: <BadgeIcon /> },
    { id: "alumni", label: "Alumni", icon: <SchoolIcon /> },
    { id: "generalMembers", label: "General Members", icon: <PersonIcon /> },
  ];

  // ------------- Effects -------------
  // Fetch categorized members on mount
  useEffect(() => {
    fetchCategorizedMembers();
  }, []);

  const fetchCategorizedMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/categorizeMember`,
      );
      setMembers(res.data.data as CategorizedMembers);
    } catch (err) {
      setError("Failed to fetch categorized members");
    } finally {
      setLoading(false);
    }
  };

  // ------------- Handlers -------------
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Update member designation
  const handleDesignationChange = async (
    userId: string,
    newDesignation: string,
  ) => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/update-designation`,
        { userId, designation: newDesignation },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setShowSuccess(true);
      setSuccessMessage("Designation updated successfully!");
      fetchCategorizedMembers();
    } catch (err: any) {
      setShowError(true);
      setErrorMessage(
        err?.response?.data?.message || "Error updating designation.",
      );
    }
  };

  // Update alumni status
  const handleAlumniChange = async (
    userId: string,
    newAlumniValue: boolean,
  ) => {
    try {
      clearAlerts();

      const token = Cookies.get("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/update-alumniStatus`,
        { userId, alumniStatus: newAlumniValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowSuccess(true);
      setSuccessMessage("Alumni status updated successfully!");
      fetchCategorizedMembers();
    } catch (err: any) {
      setShowError(true);
      setErrorMessage(
        err?.response?.data?.message || "Error updating alumni status.",
      );
      if (err?.response?.data?.errors) {
        setErrorMessage(
          err.response.data.errors.map((error: any) => error.msg).join(", "),
        );
      }
    }
  };

  /** Helper to clear all success/error flags */
  const clearAlerts = () => {
    setShowSuccess(false);
    setSuccessMessage("");
    setShowError(false);
    setErrorMessage("");
  };

  // Open modal with user details
  const openProfile = async (userId: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/member-request/${userId}`,
      );
      setSelectedUser(res.data.data);
      setShowProfile(true);
    } catch (err) {
      setShowError(true);
      setErrorMessage("Failed to fetch user details.");
    }
  };

  // Loading UI
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="50%" height={40} />
          <Skeleton variant="rectangular" height={60} sx={{ mt: 2, borderRadius: 1 }} />
        </Box>
        
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  // Error UI
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: "error.main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2
          }}
        >
          <Typography variant="h5" fontWeight="medium">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchCategorizedMembers}
            startIcon={<RefreshIcon />}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  // ------------- Render Helpers -------------
  // Render each row in the table
  const renderMemberRow = (user: User) => {
    return (
      <TableRow
        key={user._id}
        sx={{
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          },
          transition: "background-color 0.2s",
        }}
      >
        {/* Name & Image */}
        <TableCell>
          <Button
            onClick={() => openProfile(user._id)}
            sx={{ 
              textTransform: "none", 
              justifyContent: "flex-start", 
              p: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <Avatar
              src={user.profilePic || "/images/user/user-06.png"}
              alt={user.name}
              sx={{ 
                mr: 2, 
                width: 40, 
                height: 40,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
            <Typography 
              variant="body2" 
              fontWeight="medium"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {user.name}
            </Typography>
          </Button>
        </TableCell>

        {/* Department */}
        <TableCell>
          <Tooltip title={user.department}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: { xs: "100px", sm: "150px", md: "200px" }
              }}
            >
              {user.department}
            </Typography>
          </Tooltip>
        </TableCell>

        {/* Session */}
        <TableCell>
          <Chip 
            label={user.session} 
            size="small" 
            variant="outlined" 
            color="primary"
            sx={{ 
              borderRadius: '4px',
              fontWeight: 500,
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </TableCell>

        {/* Designation dropdown */}
        <TableCell>
          <Select
            value={user.designation || "Member"}
            onChange={(e) => handleDesignationChange(user._id, e.target.value as string)}
            size="small"
            fullWidth
            sx={{ 
              minWidth: { xs: "100px", sm: "150px", md: "180px" },
              fontSize: "0.875rem",
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {DESIGNATION_OPTIONS.map((des) => (
              <MenuItem key={des} value={des}>
                {des}
              </MenuItem>
            ))}
          </Select>
        </TableCell>

        {/* Alumni checkbox */}
        <TableCell align="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={!!user.alumni}
                onChange={(e) => handleAlumniChange(user._id, e.target.checked)}
                size="small"
                color="primary"
                sx={{ 
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  }
                }}
              />
            }
            label="Alumni"
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontSize: '0.875rem',
                fontWeight: 500
              }
            }}
          />
        </TableCell>
      </TableRow>
    );
  };

  // Render category selection tabs
  const renderCategoryTabs = () => {
    // For mobile, use a dropdown-like interface
    if (isMobile) {
      return (
        <Box sx={{ mb: 3 }}>
          <Select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            fullWidth
            sx={{ 
              height: '50px',
              fontWeight: 500,
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
              }
            }}
          >
            {categoryTabs.map((tab) => (
              <MenuItem key={tab.id} value={tab.id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1, display: 'flex' }}>
                  {tab.icon}
                </Box>
                {tab.label} ({members[tab.id as keyof CategorizedMembers].length})
              </MenuItem>
            ))}
          </Select>
        </Box>
      );
    }
    
    // For desktop, use a card-based interface
    return (
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {categoryTabs.map((tab) => {
          const categoryCount = members[tab.id as keyof CategorizedMembers].length;
          
          return (
            <Grid item xs={6} sm={6} md={3} key={tab.id}>
              <Card 
                onClick={() => handleCategoryChange(tab.id)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: activeCategory === tab.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                  boxShadow: activeCategory === tab.id 
                    ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}` 
                    : theme.shadows[1],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: activeCategory === tab.id 
                    ? alpha(theme.palette.primary.main, 0.05)
                    : theme.palette.background.paper,
                }}
              >
                <CardContent sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                }}>
                  <Badge 
                    badgeContent={categoryCount} 
                    color="primary"
                    sx={{ 
                      '& .MuiBadge-badge': {
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        minWidth: '22px',
                        height: '22px',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        p: 1.5,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      {tab.icon}
                    </Box>
                  </Badge>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={activeCategory === tab.id ? 600 : 500}
                    color={activeCategory === tab.id ? 'primary.main' : 'text.primary'}
                  >
                    {tab.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // Render the active category data
  const renderActiveCategory = () => {
    const currentCategory = activeCategory as keyof CategorizedMembers;
    const categoryData = members[currentCategory] || [];
    const categoryInfo = categoryTabs.find(tab => tab.id === activeCategory);
    
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box 
          sx={{ 
            px: 3, 
            py: 2, 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              color: theme.palette.primary.main,
              mr: 1,
              display: 'flex'
            }}>
              {categoryInfo?.icon}
            </Box>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {categoryInfo?.label} ({categoryData.length})
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              onClick={fetchCategorizedMembers}
              startIcon={<RefreshIcon />}
              variant="outlined"
              sx={{ borderRadius: 1 }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ 
                '& th': { 
                  backgroundColor: theme.palette.background.paper,
                  fontWeight: 600,
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
                } 
              }}>
                <TableCell width="30%">
                  <Typography fontWeight="medium">Name</Typography>
                </TableCell>
                <TableCell width="20%">
                  <Typography fontWeight="medium">Department</Typography>
                </TableCell>
                <TableCell width="15%">
                  <Typography fontWeight="medium">Session</Typography>
                </TableCell>
                <TableCell width="25%">
                  <Typography fontWeight="medium">Designation</Typography>
                </TableCell>
                <TableCell width="10%" align="center">
                  <Typography fontWeight="medium">Alumni</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryData.map(renderMemberRow)}
              {categoryData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" color="text.secondary">
                        No members found in this category
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<SearchIcon />}
                      >
                        Browse Members
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ my: 4, minHeight: "80vh" }}>
      {/* Alert Components */}
      {showSuccess && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}
      
      {/* Page Title */}
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontWeight: 700, 
          color: "text-primary",
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          pl: 2,
        }}
      >
        Member Management
      </Typography>

      {/* Category Selection */}
      {renderCategoryTabs()}

      {/* Active Category Table */}
      {renderActiveCategory()}

      {/* Profile Modal */}
      <Dialog
        open={showProfile}
        onClose={() => setShowProfile(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          }
        }}
      >
        <Box sx={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        }}>
          <Typography variant="h6" fontWeight={600}>
            Member Profile
          </Typography>
          <IconButton 
            onClick={() => setShowProfile(false)}
            sx={{ 
              color: theme.palette.grey[700],
              '&:hover': { 
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent sx={{ p: 0 }}>
          {selectedUser && <Profile user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CategorizedMembersPage;