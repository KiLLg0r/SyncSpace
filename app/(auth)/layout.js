"use client";

// Auth store
import useAuthStore from "@store/useAuthStore";

// Navigation
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const router = useRouter();

  if (currentUser) router.replace("/");

  return children;
}
