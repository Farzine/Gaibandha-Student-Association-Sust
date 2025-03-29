"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";

const SignOutPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    const token = Cookies.get("token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/admin/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to sign out");
      }

      Cookies.remove("token");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Error signing out");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
    <Container maxWidth="sm" sx={{ mt: 8 }} className=" ">
      <Paper elevation={3} sx={{ p: 4 }} className="dark:bg-[#24303F]">
        <Box display="flex" justifyContent="center" mb={2}>
          <LogoutIcon sx={{ fontSize: 50, color: "primary.main" }} />
        </Box>
        <Typography variant="h5" align="center" gutterBottom className="dark:text-white">
          Sign Out
        </Typography>
        <Typography variant="body1" align="center" className="dark:text-body-color">
          Are you sure you want to sign out?
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box display="flex" justifyContent="space-around" mt={4}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignOut}
            startIcon={<LogoutIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Out"}
          </Button>
        </Box>
      </Paper>
    </Container>
    </div>
  );
};

export default SignOutPage;
