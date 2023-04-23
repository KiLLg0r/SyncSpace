"use client";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { query, getDocs, collectionGroup, where } from "firebase/firestore";
import auth, { db } from "@config/firebase";

// React
import { useEffect, useState } from "react";

// Framer motion
import { motion, AnimatePresence } from "framer-motion";

// Components
import LoadingComponent from "@components/Loading";

// Auth store
import useAuthStore from "@store/useAuthStore";

// Nookies
import nookies from "nookies";

const AuthChange = ({ children }) => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const updateProjects = useAuthStore((state) => state.updateProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async (username) => {
      try {
        const q = query(collectionGroup(db, "projects"), where("contributors", "array-contains", username));
        const documentsRef = await getDocs(q);
        const documents = Promise.all(
          documentsRef.docs.map((doc) => ({ id: doc.id, name: doc.data().name, owner: doc.data().owner })),
        );
        return documents;
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      updateUser(user);
      if (user) getProjects(user.displayName).then((projects) => updateProjects(projects));
      setLoading(false);
      nookies.set(null, "username", user?.displayName, { path: "/" });
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
