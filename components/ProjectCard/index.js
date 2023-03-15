"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { storage } from "@config/firebase";
import { ref } from "firebase/storage";

import { useState, useEffect } from "react";

import useLanguages from "@utils/languages";

import styles from "./ProjectCard.module.scss";
import Image from "next/image";

const ProjectCard = ({ username, projectData }) => {
  const [data, setData] = useState({});
  const { getUsedLanguages, getLanguageColor } = useLanguages();

  const { name, description, img } = projectData;

  useEffect(() => {
    getUsedLanguages(ref(storage, `/users/${username}/${name}`)).then((languages) =>
      setData({
        languages: languages,
        getTotal: () => {
          let total = 0;
          Object.values(languages).forEach((value) => (total += value));
          return total;
        },
      }),
    );
  }, []);

  return (
    <div className={styles.projectCard}>
      <div className={styles.leftSide}>
        <Image src={img} alt="Project image" fill style={{ objectFit: "cover" }} />
      </div>
      <div className={styles.rightSide}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.languages}>
          {Object.keys(data).length > 0 &&
            Object.keys(data.languages).length > 0 &&
            Object.entries(data.languages).map(([key, value]) => {
              return (
                <span key={key} className={styles.language}>
                  <div className={styles.color} style={{ background: `${getLanguageColor(key).color}` }}></div>
                  {getLanguageColor(key).name} : {((value / data.getTotal()) * 100).toFixed(2) + "%"}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
