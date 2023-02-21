"use client";

// Auth store
import authStore from "@store/authStore";

// Navigation
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const currentUser = authStore((state) => state.currentUser);
  const router = useRouter();

  if (currentUser) router.replace("/");

  return children;
}
