"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  sendEmailVerification,
  updatePassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import auth from "@config/firebase";
import Loading from "@components/Loading/loading";
import Modal from "@components/Modal/modal";
import styles from "./AuthContext.module.scss";
import { useRouter } from "next/navigation";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const usernameRef = useRef(null);
  const router = useRouter();

  function register(email, password) {
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

  const changeUsername = (e) => {
    e.preventDefault();
    console.log(currentUser);
    updateProfile(currentUser, {
      displayName: usernameRef.current.value,
    }).catch((error) => alert(error));
    router.back();
  };

  const Component = ({ currentUser }) => {
    if (currentUser?.displayName || !currentUser) return children;
    return (
      <Modal open={true} disableCloseButton={true}>
        <h2>Set username</h2>
        <form onSubmit={changeUsername}>
          <input
            type="text"
            ref={usernameRef}
            className={styles.modalInput}
            required={true}
            autoFocus={true}
            placeholder="Set your username"
          />
          <button type="submit" className={styles.modalButton}>
            Set username
          </button>
        </form>
      </Modal>
    );
  };

  const value = {
    currentUser,
    userData,
    setCurrentUser,
    setUserData,
    register,
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
      {loading ? <Loading /> : <Component currentUser={currentUser} />}
    </AuthContext.Provider>
  );
}
