"use client";

import styles from "./Messages.module.scss";
import Message from "@components/Messages/Message";

// Store
import useChatStore from "@store/useChatStore";

// React
import { useState, useEffect, useRef } from "react";

// Firebase
import { collection, query, onSnapshot, doc, orderBy } from "firebase/firestore";
import { db } from "@config/firebase";

// Icons
import { BsFillArrowDownCircleFill } from "react-icons/bs";

// Custom hooks
import useIntersection from "@hooks/useIntersection";

const Messages = () => {
  const name = useChatStore((state) => state.user);
  const id = useChatStore((state) => state.conversationID);

  const [messages, setMessages] = useState([]);

  const anchorRef = useRef(null);
  const isBottom = useIntersection(anchorRef);

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

  useEffect(() => {
    if (messages.length > 0 && isBottom) anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isBottom, messages]);

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
      <div ref={anchorRef}></div>
      {!isBottom && (
        <BsFillArrowDownCircleFill
          onClick={() => anchorRef.current.scrollIntoView({ behavior: "smooth" })}
          className={styles.scrollDown}
        />
      )}
    </div>
  );
};

export default Messages;
