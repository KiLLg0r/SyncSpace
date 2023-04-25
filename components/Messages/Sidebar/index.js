"use client";

import styles from "./Sidebar.module.scss";
import Search from "@components/Messages/Search";
import Chats from "@components/Messages/Chats";

import { useState } from "react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: "17rem" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "17rem" }}
      className={styles.sidebar}
    >
      <Search changeSearching={setIsSearching} isSearching={isSearching} />
      {!isSearching && <Chats />}
    </motion.div>
  );
};

export default Sidebar;
