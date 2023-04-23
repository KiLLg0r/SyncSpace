import styles from "./Message.module.scss";
import Image from "next/image";

const Message = ({ message, img, time, name, owner }) => {
  return (
    <div className={`${styles.message} ${owner ? styles.owner : ""}`}>
      <div className={styles.messageInfo}>
        <div className={styles.img}>
          <Image src={img} alt={`${name}'s profile image`} style={{ objectFit: "cover" }} sizes={"10rem"} fill={true} />
        </div>
        <span>{time}</span>
      </div>
      <div className={styles.messageContent}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Message;
