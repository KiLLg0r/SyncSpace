import styles from "./Chat.module.scss";
import Messages from "@components/Messages/Messages";
import Input from "@components/Messages/Input";

const Chat = () => {
  return ( 
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
        <span>Jane</span>
      </div>
      <Messages />
      <Input />
    </div>
   );
}
 
export default Chat;