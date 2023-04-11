import Image from "next/image";
import styles from "./ProjectData.module.scss";

// Firebase
import { doc, getDoc } from "firebase/firestore";
import { db } from "@config/firebase";

// Components
import ProgrammingLanguages from "@components/ProgrammingLanguages";

const getProfileImages = async (contributors = []) => {
  const promises = contributors.map(async (contributor) => {
    const docRef = doc(db, "users", contributor);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data.img;
    }
  });

  const images = await Promise.all(promises);
  return images.filter((img) => img !== undefined);
};

export const SideProjectData = async ({ projectData }) => {
  const contributorsIMGs = await getProfileImages(projectData?.contributors);

  return (
    <aside className={styles.aside}>
      {projectData?.owner && (
        <div className={styles.item}>
          <div className={styles.label}>Owner</div>
          <div className={styles.value}>{projectData.owner}</div>
        </div>
      )}
      {projectData?.contributors && (
        <div className={styles.item}>
          <div className={styles.label}>Contributors</div>
          {projectData.contributors.map((contributor, index) => (
            <div className={styles.contributor} key={index}>
              <div className={styles.img}>
                <Image
                  src={contributorsIMGs[index]}
                  alt={`${contributor} profile image`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes={"1.5rem"}
                />
              </div>
              <div className={styles.name}>{contributor}</div>
            </div>
          ))}
        </div>
      )}
      <ProgrammingLanguages username={projectData?.owner} projectName={projectData?.name} />
    </aside>
  );
};

const ProjectData = ({ projectData }) => {
  return (
    <div className={styles.projectData}>
      <div className={styles.img}>
        <Image src={projectData?.img} alt="Project image" fill style={{ objectFit: "cover" }} sizes={"10rem"} />
      </div>
      <div className={styles.text}>
        {projectData?.name && <div className={styles.header}>{projectData.name}</div>}
        {projectData?.description && (
          <div className={styles.item}>
            <div className={styles.label}>Description</div>
            <div className={styles.value}>{projectData.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectData;
