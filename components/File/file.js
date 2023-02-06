import styles from "./File.module.scss";
import { BsFileEarmark, BsFolderFill, BsChevronUp } from "react-icons/bs";
import { useState } from "react";

const Folder = ({ children, name, focused, onClick, rightClick }) => {
  const [close, setClose] = useState(true);

  const handleClick = () => {
    onClick();
    setClose(!close);
  };

  return (
    <div className={`${styles.folder} ${focused && styles.focused}`} onContextMenu={rightClick}>
      <div className={styles.content} onClick={handleClick}>
        <BsChevronUp className={`${styles.chevron} ${close && styles.closedFolder}`} />
        <BsFolderFill />
        {name}
      </div>
      <div className={`${styles.children} ${close ? styles.closed : styles.open}`}>{children}</div>
    </div>
  );
};

const File = ({ name, onClick, focused, rightClick }) => {
  return (
    <div className={`${styles.file} ${focused && styles.focused}`} onClick={onClick} onContextMenu={rightClick}>
      <div className={styles.content}>
        <BsFileEarmark />
        {name}
      </div>
    </div>
  );
};
export { File, Folder };
