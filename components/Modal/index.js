"use client";

import { useEffect } from "react";
import { BsX } from "react-icons/bs";
import styles from "./Modal.module.scss";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <AnimatePresence>
      {open && (
        <div className={styles.modalContainer}>
          <div className={styles.modalBackground} onClick={onClose}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.modalContent}
          >
            <div className={styles.header}>{!disableCloseButton && <BsX onClick={onClose} />}</div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
