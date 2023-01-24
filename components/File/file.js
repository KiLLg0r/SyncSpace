import styles from "./File.module.scss";

const File = ({ children, name }) => {
  return (
    <div className={styles.file}>
      {children}
      {name}
    </div>
  );
};

export default File;
