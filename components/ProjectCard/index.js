import { storage } from "@config/firebase";
import { ref } from "firebase/storage";

import useLanguages from "@hooks/useLanguages";

import styles from "./ProjectCard.module.scss";
import Image from "next/image";

import Link from "next/link";

const ProjectCard = async ({ username, projectData }) => {
  const { name, description, img } = projectData;
  const { getUsedLanguages, getLanguageColor } = useLanguages();

  const languages = await getUsedLanguages(ref(storage, `/users/${username}/${projectData.name}`));

  return (
    <Link href={`/${username}/${name}`} className={styles.projectCard}>
      <div className={styles.leftSide}>
        <Image src={img} alt="Project image" fill style={{ objectFit: "cover" }} sizes={"10rem"} />
      </div>
      <div className={styles.rightSide}>
        <h3 className={styles.name}>
          <div className={styles.label}>Project name</div>
          {name}
        </h3>
        {description && (
          <>
            <div className={styles.label}>Project description</div>
            <p className={styles.description}>{description}</p>
          </>
        )}
        {Object.keys(languages).length > 0 && (
          <>
            <div className={styles.label}>Languages used</div>
            <div className={styles.languages}>
              {Object.keys(languages).map((key) => {
                return (
                  <span key={key} className={styles.language}>
                    <div className={styles.color} style={{ background: `${getLanguageColor(key).color}` }}></div>
                    {getLanguageColor(key).name}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
