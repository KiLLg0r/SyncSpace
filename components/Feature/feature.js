import styles from "./Feature.module.scss";

const Feature = ({ children, title, desc }) => {
  return (
    <div className={styles.feature}>
      <div className={styles.icon}>{children}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{desc}</div>
    </div>
  );
};
export default Feature;
