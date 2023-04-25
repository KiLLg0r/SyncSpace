"use client";

import styles from "./Chats.module.scss";

// React
import { useState, useEffect } from "react";
import Image from "next/image";

// Firebase
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@config/firebase";

// Store
import useAuthStore from "@store/useAuthStore";
import useChatStore from "@store/useChatStore";

const Chats = () => {
  const [conversations, setConversations] = useState([]);

  const changeConversation = useChatStore((state) => state.updateConversation);

  const user = useAuthStore((state) => state.currentUser);
  const username = user?.displayName;

  useEffect(() => {
    if (user !== null) {
      const conversationsRef = collection(db, "conversations");
      const conversationsQuery = query(conversationsRef, where("users", "array-contains", username));

      const unsubscribe = onSnapshot(conversationsQuery, (conversationsSnapshot) => {
        const conversationsData = conversationsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setConversations(conversationsData);
      });

      return unsubscribe;
    }
  }, [user, username]);

  return (
    <div className={styles.chats}>
      {conversations
        .sort((a, b) => b.lastMessageSendTime - a.lastMessageSendTime)
        .map((conversation) => {
          const userIndex = conversation?.users[0] === username ? 1 : 0;
          return (
            <div
              className={styles.userChat}
              key={conversation.id}
              onClick={() =>
                changeConversation(conversation.id, conversation?.users[userIndex], conversation?.imgs[userIndex])
              }
            >
              <div className={styles.userChatImg}>
                <Image
                  src={conversation?.imgs[userIndex]}
                  fill={true}
                  alt={`${conversation?.users[userIndex]}'s profile image`}
                  style={{ objectFit: "cover" }}
                  sizes={"10rem"}
                />
              </div>
              <div className={styles.userChatInfo}>
                <span>{conversation?.users[userIndex]}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
