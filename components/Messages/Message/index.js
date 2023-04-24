import styles from "./Message.module.scss";
import Image from "next/image";

const Message = ({ message, img, time, name, owner }) => {
  const ms = time?.seconds * 1000;
  const hours = new Date(ms).getHours();
  const minutes = new Date(ms).getMinutes();

  return (
    <div className={`${styles.message} ${owner ? styles.owner : ""}`}>
      <div className={styles.messageInfo}>
        <div className={styles.img}>
          <Image
            src={img ?? "https://www.odonovan.co.uk/wp-content/uploads/2018/05/Placeholder-image.jpg"}
            alt={`${name}'s profile image`}
            style={{ objectFit: "cover" }}
            sizes={"10rem"}
            fill={true}
          />
        </div>
        <span>{`${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`}</span>
      </div>
      <div className={styles.messageContent}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Message;
