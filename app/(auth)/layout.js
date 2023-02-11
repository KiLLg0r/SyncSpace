"use client";

import "@styles/globals.css";
import { useAuth } from "@context/AuthContext";
import { useRouter } from "next/navigation";
import LoadingComponent from "@components/Loading/loading";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  if (currentUser) {
    router.replace("/");
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <LoadingComponent />
      </motion.div>
    );
  }

  return children;
}
