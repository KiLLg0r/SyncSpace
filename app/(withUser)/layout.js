"use client";

// Auth store
import authStore from "@store/authStore";

// Navigation
import { useRouter } from "next/navigation";
import { useState } from "react";

// Sidebar
import Sidebar from "@components/Sidebar";

// Styles
import styles from "./Layout.module.scss";

export default function Layout({ children }) {
  const currentUser = authStore((state) => state.currentUser);
  const router = useRouter();

  const [key, setKey] = useState(new Date());

  if (!currentUser) router.replace("/login");

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <button
        type="button"
        onClick={() => setKey(new Date())}
        style={{ position: "fixed", bottom: "1rem", right: "1rem" }}
      >
        Rerender child
      </button>
      <div className={styles.content} key={key}>
        {children}
      </div>
    </div>
  );
}
