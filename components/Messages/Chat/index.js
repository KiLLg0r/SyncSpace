"use client";

import styles from "./Chat.module.scss";
import Messages from "@components/Messages/Messages";
import Input from "@components/Messages/Input";

import useChatStore from "@store/useChatStore";

import Image from "next/image";

const Chat = () => {
  const name = useChatStore((state) => state.user);

  return (
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
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
    </div>
  );
};

export default Chat;
