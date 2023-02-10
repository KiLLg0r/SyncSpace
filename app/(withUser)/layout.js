"use client";

import "@styles/globals.css";
import { useAuth } from "@context/AuthContext";
import { useRouter } from "next/navigation";
import LoadingComponent from "@components/Loading/loading";

export default function Layout({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  if (!currentUser) {
    router.replace("/login");
    return <LoadingComponent />;
  }

  return children;
}
