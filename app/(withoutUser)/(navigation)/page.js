import styles from "./Home.module.scss";
import Link from "next/link";
import Feature from "@components/Feature/feature";
import { BsFillBrightnessHighFill } from "react-icons/bs";
const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.container}>
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
            <div className={styles.planet}></div>
          </div>
        </main>
      </div>
      <Link href="/new">New project</Link>
      <div className={styles.features}>
        <div className={`${styles.rectangle} ${styles.rect1}`}></div>
        <main className={styles.content}>
          <div className={`${styles.container} ${styles.featuresLayout}`}>
            <Feature
              title="Ceva"
              desc="Lorem Ipsum is simplyPageMaker including versions of Lorem Ipsum."
            >
              <BsFillBrightnessHighFill />
            </Feature>
            <Feature
              title="Ceva"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            >
              <BsFillBrightnessHighFill />
            </Feature>
            <Feature
              title="Ceva"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            >
              <BsFillBrightnessHighFill />
            </Feature>
          </div>
        </main>
        <div className={`${styles.rectangle} ${styles.rect2}`}></div>
      </div>
    </div>
  );
};

export default Home;
