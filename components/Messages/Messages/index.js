"use client";

import styles from "./Messages.module.scss";
import Message from "@components/Messages/Message";

// Store
import useChatStore from "@store/useChatStore";

// React
import { useState, useEffect } from "react";

// Firebase
import { collection, query, onSnapshot, doc, orderBy } from "firebase/firestore";
import { db } from "@config/firebase";

const Messages = () => {
  const name = useChatStore((state) => state.user);
  const id = useChatStore((state) => state.conversationID);

  const [messages, setMessages] = useState(0);

  useEffect(() => {
    if (id !== null) {
      const d = doc(db, "conversations", id);
      const q = query(collection(d, "messages"), orderBy("sendTime"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setMessages(msgs);
      });

      return unsubscribe;
    }
  }, [id]);

  return (
    <div className={styles.messages}>
      {messages &&
        messages.map((message) => (
          <Message
            key={message.id}
            owner={message.sender !== name}
            message={message.message}
            img={message.senderIMG}
            time={message.sendTime}
            name={message.sender}
          />
        ))}
    </div>
  );
};

export default Messages;
