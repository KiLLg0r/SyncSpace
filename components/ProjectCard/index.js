import styles from "./ProjectCard.module.scss";
import Image from "next/image";

import Link from "next/link";

import ProgrammingLanguages from "@components/ProgrammingLanguages";

const ProjectCard = ({ username, projectData, inDashboard = false }) => {
  const { name, description, img } = projectData;

  return (
    <Link href={`/${inDashboard ? "projects" : username}/${name}`} className={styles.projectCard}>
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
        <ProgrammingLanguages username={username} projectName={name} />
      </div>
    </Link>
  );
};

export default ProjectCard;
