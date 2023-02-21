// Zustand
import { create } from "zustand";

// Firebase
import auth from "@config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  sendEmailVerification,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const authStore = create((set) => ({
  currentUser: null,
  userData: null,
  createAccount: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
  resetPassword: (email) => auth.sendPasswordResetEmail(email),
  updateUserEmail: (email) => updateEmail(currentUser, email),
  updateUserPassword: (password) => updatePassword(currentUser, password),
  sendUserEmailVerification: () => sendEmailVerification(currentUser),
  sendUserPasswordResetEmail: (email) => sendPasswordResetEmail(auth, email),
  updateUser: (user) => set({ currentUser: user }),
  updateUserData: (data) => set({ userData: data }),
}));

export default authStore;
