import styles from "../styles/Layout.module.scss";
import Navigation from "./navigation";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default Layout;
