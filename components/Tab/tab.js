import { BsX } from "react-icons/bs";
import styles from "./Tab.module.scss";

const Tab = ({ name, active, onClick, onClose, path }) => {
  return (
    <div className={styles.tabContainer} title={path}>
      <div className={`${styles.tab} ${active && styles.active}`} onClick={onClick}>
        {name}
      </div>
      <BsX onClick={onClose} className={styles.closeBtn} />
    </div>
  );
};

export default Tab;
