"use client";

import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import styles from "./Modal.module.scss";

const Modal = ({ children, onClose, open, disableCloseButton = false }) => {
  useEffect(() => {
    if (open) {
      document.body.classList.remove("closed");
      document.body.classList.add("open");
    } else {
      document.body.classList.remove("open");
      document.body.classList.add("closed");
    }
  }, [open]);

  if (open)
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalBackground} onClick={onClose}></div>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            {!disableCloseButton && <BsX onClick={onClose} />}
          </div>
          {children}
        </div>
      </div>
    );
};

export default Modal;
