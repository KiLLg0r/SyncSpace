"use client";

// Auth store
import authStore from "@store/authStore";

// Navigation
import { useRouter, usePathname } from "next/navigation";

// Sidebar
import Sidebar from "@components/Sidebar";

// Styles
import styles from "./Layout.module.scss";

export default function Layout({ children }) {
  const currentUser = authStore((state) => state.currentUser);
  const router = useRouter();

  const path = usePathname();

  if (!currentUser)
    if (path === "/") router.replace("/home");
    else router.replace("/login");

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
