import { RiSpaceShipLine } from "react-icons/ri";
import { BiSearchAlt } from "react-icons/bi";
import styles from "../styles/Nav.module.scss";

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <RiSpaceShipLine />
        <div className={styles.name}>SyncSpace</div>
      </div>
      <div className={styles.center}>
        <div className={styles.search}>
          <input type="text" placeholder="Search for projects..." />
          <div className={styles.icon}>
            <BiSearchAlt />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <button>
          <div className={styles["user-name"]}>User</div>
          <img src="/user.png" alt="user" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
