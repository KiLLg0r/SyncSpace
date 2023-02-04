import styles from "./File.module.scss";
import { BsFileEarmark, BsFolderFill, BsChevronUp } from "react-icons/bs";
import { useState } from "react";

const Folder = ({ children, name }) => {
  const [close, setClose] = useState(true);

  return (
    <div className={styles.folder}>
      <div className={styles.content} onClick={() => setClose(!close)}>
        <BsChevronUp className={`${styles.chevron} ${close && styles.closedFolder}`} />
        <BsFolderFill />
        {name}
      </div>
      <div className={`${styles.children} ${close && styles.closed}`}>{children}</div>
    </div>
  );
};

const File = ({ name, onClick }) => {
  return (
    <div className={styles.file} onClick={onClick}>
      <div className={styles.content}>
        <BsFileEarmark />
        {name}
      </div>
    </div>
  );
};
export { File, Folder };
