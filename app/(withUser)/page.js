// Styles
import styles from "./Home.module.scss";

const Welcome = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.background}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome to <span>Sync</span>Space
        </h1>
        <p className={styles.description}>
          SyncSpace is a collaborative code editor that allows you to work on projects with your collaborators.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
