import styles from "./Chat.module.scss";

const Chat = () => {
  return ( 
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
        <span>Jane</span>
        <div className={styles.chatIcons}>
          <img src="planet.svg" alt="icon" />
          <img src="planet.svg" alt="icon" />
          <img src="planet.svg" alt="icon" />
        </div>
      </div>
    </div>
   );
}
 
export default Chat;