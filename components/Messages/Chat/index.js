"use client";

import styles from "./Chat.module.scss";
import Messages from "@components/Messages/Messages";
import Input from "@components/Messages/Input";

import useChatStore from "@store/useChatStore";

import Image from "next/image";

import { BsChevronLeft } from "react-icons/bs";
import { motion } from "framer-motion";

const Chat = () => {
  const name = useChatStore((state) => state.user);
  const changeConversation = useChatStore((state) => state.updateConversation);

  return (
    <motion.div
      initial={{ opacity: 0, x: "17rem" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "17rem" }}
      className={styles.chat}
    >
      <div className={styles.chatInfo}>
        <BsChevronLeft onClick={() => changeConversation(null, null, "")} />
        <div className={styles.img}>
          <Image
            src={useChatStore((state) => state.userImg)}
            alt={`${name}'s profile image`}
            style={{ objectFit: "cover" }}
            sizes={"10rem"}
            fill={true}
          />
        </div>
        <span>{name}</span>
      </div>
      <Messages />
      <Input />
    </motion.div>
  );
};

export default Chat;
