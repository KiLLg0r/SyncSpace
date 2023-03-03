import { BsX } from "react-icons/bs";
import styles from "./Tab.module.scss";

const Tab = ({ name, active, onClick, onClose, path }) => {
  return (
    <div className={`${styles.tabContainer} ${active && styles.active}`} title={path}>
      <div className={styles.tab} onClick={onClick}>
        {name}
      </div>
      <BsX onClick={onClose} className={styles.closeBtn} />
    </div>
  );
};

export default Tab;
