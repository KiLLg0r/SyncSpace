"use client";

import styles from "./Home.module.scss";
import { motion } from "framer-motion";

const Home = () => {
  const textContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.25,
      },
    },
  };

  const textItem = {
    hidden: { opacity: 0, y: -50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const featuresContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const featureItemRight = {
    hidden: { opacity: 0, x: -200 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 1,
      },
    },
  };

  const featureItemLeft = {
    hidden: { opacity: 0, x: 200 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.5,
      },
    },
  };

  const featureItemCenter = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.25,
      },
    },
  };

  return (
    <motion.div
      className={styles.home}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <main className={styles.main}>
          <motion.div
            variants={textContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.text}
          >
            <motion.div variants={textItem} className={styles.maintext1}>
              TOGETHER
            </motion.div>
            <motion.div variants={textItem} className={styles.maintext2}>
              WE SHIP <span>YOU</span>
            </motion.div>
            <motion.div variants={textItem} className={styles.maintext3}>
              TO THE <span>NEXT</span>
            </motion.div>
            <motion.div variants={textItem} className={styles.maintext4}>
              LEVEL
            </motion.div>
          </motion.div>
          <div className={styles.planetContainer}>
            <div className={styles.planet}></div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default Home;
