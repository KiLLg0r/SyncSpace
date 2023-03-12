import styles from "./Whitespace.module.scss";

const Whitespace = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Whitespace;
