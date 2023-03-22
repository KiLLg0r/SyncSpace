import styles from "./Sidebar.module.scss";
import Navbar from "@components/Messages/Navbar";
import Search from "@components/Messages/Search";
import Chats from "@components/Messages/Chats";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
