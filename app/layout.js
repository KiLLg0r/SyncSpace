"use client";

import "@styles/globals.css";
import { AuthProvider } from "@context/AuthContext";
import Username from "@components/Username/username";
import { useState, useEffect } from "react";
import LoadingComponent from "@components/Loading/loading";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>SyncSpace</title>
      </head>
      <body>
        <div>
          <AuthProvider>
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LoadingComponent />
                </motion.div>
              )}
            </AnimatePresence>
            <Username>{children}</Username>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
