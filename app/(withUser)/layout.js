"use client";

// Auth store
import useAuthStore from "@store/useAuthStore";

// Navigation
import { useRouter, usePathname } from "next/navigation";

// Sidebar
import Sidebar from "@components/Sidebar";

// Styles
import styles from "./Layout.module.scss";

// React
import { useState } from "react";

// Icons
import { BsChatRightDots } from "react-icons/bs";

// Components
import Messages from "@components/Messages";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const router = useRouter();

  const path = usePathname();

  const [showMessages, setShowMessages] = useState(false);

  if (!currentUser)
    if (path === "/") router.replace("/home");
    else router.replace("/login");

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.content}>{children}</div>
      <div className={styles.messages}>
        <AnimatePresence key={"messagesTransition"}>
          {showMessages && (
            <motion.div
              initial={{ opacity: 0, y: "100vh" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100vh" }}
            >
              <Messages />
            </motion.div>
          )}
        </AnimatePresence>
        <div className={styles.header} onClick={() => setShowMessages(!showMessages)}>
          <BsChatRightDots />
          <h4>Messages</h4>
        </div>
      </div>
    </div>
  );
}
