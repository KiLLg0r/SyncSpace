"use client";

import Sidebar from "./Sidebar";
import Chat from "./Chat";

import styles from "./Messages.module.scss";

import useChatStore from "@store/useChatStore";

import { AnimatePresence } from "framer-motion";

const Messages = () => {
  const convID = useChatStore((state) => state.conversationID);

  return (
    <div className={styles.container}>
      <AnimatePresence>{convID !== null ? <Chat /> : <Sidebar />}</AnimatePresence>
    </div>
  );
};

export default Messages;
