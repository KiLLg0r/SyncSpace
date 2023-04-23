"use client";

import styles from "./Sidebar.module.scss";
import Search from "@components/Messages/Search";
import Chats from "@components/Messages/Chats";

import { useState } from "react";

const Sidebar = () => {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className={styles.sidebar}>
      <Search changeSearching={setIsSearching} isSearching={isSearching}/>
      {!isSearching && <Chats />}
    </div>
  );
};

export default Sidebar;
