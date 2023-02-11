"use client";

import React, { useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  sendEmailVerification,
  updatePassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import auth from "@config/firebase";
import LoadingComponent from "@components/Loading/loading";
import { motion, AnimatePresence } from "framer-motion";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();

  function createAccount(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateUserEmail(email) {
    updateEmail(currentUser, email);
  }

  function updateUserPassword(password) {
    updatePassword(currentUser, password);
  }

  function sendUserEmailVerification() {
    sendEmailVerification(currentUser);
  }

  function sendUserPasswordResetEmail(email) {
    sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    setCurrentUser,
    setUserData,
    createAccount,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    sendUserEmailVerification,
    sendUserPasswordResetEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      <AnimatePresence>
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingComponent />
          </motion.div>
        ) : (
          children
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}
