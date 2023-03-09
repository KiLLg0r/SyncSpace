"use client";

// Auth context
import authStore from "@store/authStore";

// Components
import Modal from "@components/Modal";

// Styles
import styles from "@components/Modal/Modal.module.scss";
import errorStyles from "@styles/Error.module.css";

// Next router
import { useRouter } from "next/navigation";

// Firebase
import { updateProfile } from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";

// React hooks form
import { useForm } from "react-hook-form";

// Animation
import { motion, AnimatePresence } from "framer-motion";

// Firestore
import { db } from "@config/firebase";

// React
import { useState } from "react";

const Username = ({ children }) => {
  const currentUser = authStore((state) => state.currentUser);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(true);

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const changeUsername = async (data, e) => {
    e.preventDefault();

    const userRef = doc(db, "users", data.username);
    const docSnapshot = await getDoc(userRef);

    if (docSnapshot.exists()) {
      setError("username", { type: "taken", message: "This username is taken. Try something else!" });
    } else {
      updateProfile(currentUser, {
        displayName: data.username,
      }).catch((error) => alert(error));

      await setDoc(doc(db, "users", data.username), {
        name: data.username,
      }).catch((error) => alert(error));

      setOpenModal(false);

      router.replace("/");
    }
  };

  if (currentUser?.displayName || currentUser === null) return children;
  return (
    <Modal open={openModal} disableCloseButton={true}>
      <h2>Set username</h2>
      <form onSubmit={handleSubmit(changeUsername)}>
        <input
          className={styles.modalInput}
          autoFocus={true}
          placeholder="Set your username"
          type="text"
          aria-invalid={errors.username ? "true" : "false"}
          {...register("username", { required: true, min: 3, pattern: /^[A-Za-z][A-Za-z0-9_-]{7,29}$/i })}
        />
        <AnimatePresence>
          {errors.username?.type === "required" && (
            <motion.p
              role="alert"
              className={errorStyles.error}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              A username is required
            </motion.p>
          )}
          {errors.username?.type === "taken" && (
            <motion.p
              role="alert"
              className={errorStyles.error}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              {errors.username?.message}
            </motion.p>
          )}
        </AnimatePresence>
        <button type="submit" className={styles.modalButton}>
          Set username
        </button>
      </form>
    </Modal>
  );
};

export default Username;
