import styles from "./Layout.module.scss";
import "../styles/globals.css";

export default function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}
