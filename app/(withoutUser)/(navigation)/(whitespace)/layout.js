"use client";

import styles from "./Layout.module.scss";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  if (pathname.includes("edit")) return children;

  return <div className={styles.container}>{children}</div>;
}
