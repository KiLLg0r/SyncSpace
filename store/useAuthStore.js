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

const useAuthStore = create((set) => ({
  currentUser: null,
  userData: null,
  projects: [],
  createAccount: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
  resetPassword: (email) => auth.sendPasswordResetEmail(email),
  updateUserEmail: (email) => {
    const user = get().currentUser;
    updateEmail(user, email);
  },
  updateUserPassword: (password) => {
    const user = get().currentUser;
    updatePassword(user, password);
  },
  sendUserEmailVerification: () => {
    const user = get().currentUser;
    sendEmailVerification(user);
  },
  sendUserPasswordResetEmail: (email) => sendPasswordResetEmail(auth, email),
  updateUser: (user) => set({ currentUser: user }),
  updateUserData: (data) => set({ userData: data }),
  updateProjects: (data) => set({ projects: data }),
}));

export default useAuthStore;
