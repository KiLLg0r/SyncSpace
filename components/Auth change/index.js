"use client";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import auth from "@config/firebase";

// React
import { useEffect, useState } from "react";

// Framer motion
import { motion, AnimatePresence } from "framer-motion";

// Components
import LoadingComponent from "@components/Loading";

// Auth store
import authStore from "@store/authStore";

const AuthChange = ({ children }) => {
  const updateUser = authStore((state) => state.updateUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      updateUser(user);
      setLoading(false);
    });

    return unsubscribe;
  });
  return (
    <AnimatePresence key={"userChange"}>
      {loading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoadingComponent />
        </motion.div>
      ) : (
        children
      )}
    </AnimatePresence>
  );
};

export default AuthChange;
