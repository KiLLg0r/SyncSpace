import "../../../styles/globals.css";
import styles from "./Home.module.scss";
import Planet from "../../../public/planet.svg";

const Home = () => {
  return (
    <div className={styles.home}>
      <main className={styles.main}>
        <div className={styles.text}>
          <div className={styles.maintext1}>TOGETHER</div>
          <div className={styles.maintext2}>
            WE SHIP <span>YOU</span>
          </div>
          <div className={styles.maintext3}>
            TO THE <span>NEXT</span>
          </div>
          <div className={styles.maintext4}>LEVEL</div>
        </div>
        <div className={styles.planetContainer}>
          <Planet className={styles.planet} />
        </div>
      </main>

      <div className={styles.features}></div>
    </div>
  );
};

export default Home;
