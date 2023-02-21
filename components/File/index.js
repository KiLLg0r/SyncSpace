// Styles
import styles from "./File.module.scss";

// Icons
import { BsFileEarmark, BsFolderFill, BsChevronUp } from "react-icons/bs";

// React
import React, { useState } from "react";

// Framer motion
import { motion } from "framer-motion";

const variants = {
  hover: {
    scale: 1.025,
    color: "#ffffff",
  },
  click: {
    scale: 0.975,
  },
};

const Folder = React.memo(function Folder({ children, name, focused, onClick, rightClick }) {
  const [close, setClose] = useState(true);

  const handleClick = () => {
    onClick();
    setClose(!close);
  };

  return (
    <div className={`${styles.folder} ${focused && styles.focused}`}>
      <motion.div
        variants={variants}
        whileHover="hover"
        whileTap="click"
        className={styles.content}
        onClick={handleClick}
        onContextMenu={rightClick}
      >
        <BsChevronUp className={`${styles.chevron} ${close && styles.closedFolder}`} />
        <BsFolderFill />
        {name}
      </motion.div>
      <div className={`${styles.children} ${close ? styles.closed : styles.open}`}>{children}</div>
    </div>
  );
});

const File = ({ name, onClick, focused, rightClick }) => {
  return (
    <div className={`${styles.file} ${focused && styles.focused}`} onClick={onClick} onContextMenu={rightClick}>
      <motion.div variants={variants} whileHover="hover" whileTap="click" className={styles.content}>
        <BsFileEarmark />
        {name}
      </motion.div>
    </div>
  );
};
export { File, Folder };
