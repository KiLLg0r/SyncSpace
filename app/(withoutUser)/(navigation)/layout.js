"use client";

import { usePathname } from "next/navigation";
import Navigation from "@components/Navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  if (pathname.includes("edit")) return children;

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
