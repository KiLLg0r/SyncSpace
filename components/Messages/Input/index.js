"use client";

import styles from "./Input.module.scss";
import { BsPaperclip, BsImages } from "react-icons/bs";
import { useState } from "react";

// Firebase
import { doc, serverTimestamp, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@config/firebase";

import useChatStore from "@store/useChatStore";
import useAuthStore from "@store/useAuthStore";

const Input = () => {
  const [message, setMessage] = useState("");

  const id = useChatStore((state) => state.conversationID);
  const name = useChatStore((state) => state.user);
  const img = useChatStore((state) => state.userImg);

  const user = useAuthStore((state) => state.currentUser);

  const sendMessage = async (e) => {
    e.preventDefault();

    const msg = message;
    const time = serverTimestamp();

    setMessage("");

    const conversationRef = doc(db, "conversations", id);
    await addDoc(collection(conversationRef, "messages"), {
      message: msg,
      receiver: name,
      receiverIMG: img,
      sender: user.displayName,
      senderIMG: user.photoURL,
      sendTime: time,
    });
    await updateDoc(conversationRef, {
      lastMessage: msg,
      lastMessageSendTime: time,
    });
  };

  return (
    <div className={styles.input}>
      <input
        type="text"
        placeholder="Type something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
      />
      <div className={styles.send}>
        <button type="button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
