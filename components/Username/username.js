"use client";

import { useAuth } from "@context/AuthContext";
import Modal from "@components/Modal/modal";
import styles from "@components/Modal/Modal.module.scss";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";

const Username = ({ children }) => {
  const { currentUser } = useAuth();
  const usernameRef = useRef(null);
  const router = useRouter();

  const changeUsername = (e) => {
    e.preventDefault();
    console.log(currentUser);
    updateProfile(currentUser, {
      displayName: usernameRef.current.value,
    }).catch((error) => alert(error));
    router.replace("/");
  };

  if (currentUser?.displayName || currentUser === null) return children;
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

export default Username;
