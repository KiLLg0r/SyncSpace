import styles from "./Chats.module.scss";

const Chats = () => {
  return (
    <div className={styles.chats}>
      <div className={styles.userChat}>
        <img src="planet.svg" alt="altceva" />
        <div className={styles.userChatInfo}>
          <span>Jane</span>
          <p>Hello!</p>
        </div>
      </div>
    </div>
  );
};

export default Chats;
