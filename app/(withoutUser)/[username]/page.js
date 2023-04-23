import Projects from "@components/Projects";
import ProfileCard from "@components/ProfileCard";

import styles from "./UserPage.module.scss";

const User = ({ params }) => {
  return (
    <div className={styles.userPage}>
      <div className={styles.profile}>
        <ProfileCard username={params.username} />
      </div>
      <div className={styles.projects}>
        <h1 className={styles.title}>Projects</h1>
        <Projects username={params.username} />
      </div>
    </div>
  );
};

export default User;
