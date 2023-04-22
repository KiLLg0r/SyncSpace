import styles from "./Messages.module.scss";
import Message from "@components/Messages/Message";

const Messages = () => {
  return ( 
    <div className={styles.messages}>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
    </div>
   );
}
 
export default Messages;