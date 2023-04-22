import styles from "./Message.module.scss";

const Message = () => {
  return (
    <div className={`${styles.message} `}>
      <div className={styles.messageInfo}>
        <img src="planet.svg" alt="icon" />
        <span>Just now</span>
      </div>
      <div className={styles.messageContent}>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed est</p>
        {/* <img src="planet.svg" alt="icon" /> */}
      </div>
    </div>
  );
};

export default Message;
