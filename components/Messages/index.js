import Sidebar from "./Sidebar";
import Chat from "./Chat";

import styles from "./Messages.module.scss"


const Messages = () => {
  return ( 
    <div className={styles.home}>
      <div className={styles.container}>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
   );
}
 
export default Messages;