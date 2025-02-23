"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Container, Typography, Paper, Box, CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const SignOutPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // Optional: store an error if you’d like to show it in the UI
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignOut = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (!res.ok) {
        throw new Error("Failed to sign out");
        console.log(res);
      }

      // On success, remove the token and navigate home
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
    <Container className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 relative">
      {/* Loader Overlay */}
      {loading && (
        <Box
          className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-30"
          sx={{ backdropFilter: "blur(2px)" }}
        >
          <CircularProgress size={50} />
        </Box>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
        }}
        className="w-full max-w-md"
      >
        <Paper
          elevation={0}
          className="p-8 md:p-10 rounded-2xl backdrop-blur-lg dark:bg-gray-dark dark:text-white relative"
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mb-6"
          >
            <LogoutIcon
              sx={{
                fontSize: { xs: 50, sm: 70 },
                color: "primary.main",
              }}
              className="drop-shadow-xl"
            />
          </motion.div>

          <Typography
            variant="h4"
            className="text-center text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-5"
          >
            Sign Out
          </Typography>

          <Typography variant="body1" className="text-center text-gray-600 mb-8">
            Are you sure you want to sign out from your account?
          </Typography>

          {/* Optional: show an error message if sign-out fails */}
          {error && (
            <Typography variant="body2" color="error" className="text-center mb-4">
              {error}
            </Typography>
          )}

          <Box className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outlined"
                onClick={() => router.back()}
                className="w-full sm:w-auto normal-case text-base py-2 px-8"
                sx={{
                  borderRadius: "10px",
                  borderWidth: "2px",
                  "&:hover": {
                    borderWidth: "2px",
                  },
                }}
              >
                Cancel
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignOut}
                startIcon={<LogoutIcon />}
                className="w-full sm:w-auto normal-case text-base py-2 px-8"
                sx={{
                  borderRadius: "10px",
                  background: "linear-gradient(to right, #2563eb, #4f46e5)",
                  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(to right, #1d4ed8, #4338ca)",
                  },
                }}
                disabled={loading} // disables the button while loading
              >
                Sign Out
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default SignOutPage;
