"use client";

// Styles
import "@styles/globals.css";

// Components
import Username from "@components/Username";
import LoadingComponent from "@components/Loading";
import AuthChange from "@components/AuthChange";

// React
import { useState, useEffect } from "react";

// Framer motion
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>SyncSpace</title>
      </head>
      <body>
        <div>
          <AuthChange>
            <AnimatePresence key={"pageTransition"}>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingComponent />
                </motion.div>
              )}
            </AnimatePresence>
            <Username>{children}</Username>
          </AuthChange>
        </div>
      </body>
    </html>
  );
}
