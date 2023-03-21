"use client";

import styles from "./Layout.module.scss";
import Navigation from "@components/Navigation";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <div className={styles.container}>{children}</div>
    </>
  );
}
