import { db } from "@config/firebase";
import { getDocs, collection } from "firebase/firestore";

import ProjectCard from "@components/ProjectCard";
import styles from "./Projects.module.scss";
import Empty from "@public/empty.svg";

const getProjects = async (username) => {
  try {
    const documentsRef = await getDocs(collection(db, "users", username, "projects"));
    const documents = Promise.all(documentsRef.docs.map((doc) => doc.data()));
    return documents;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Projects = async ({ username, owner = false, inDashboard = false }) => {
  const projects = await getProjects(username);

  return projects.length > 0 ? (
    <div className={styles.projects}>
      {projects.map((project) => {
        if (project.visibility === "public" || owner)
          return (
            <ProjectCard
              key={project.lastModified.seconds}
              projectData={project}
              username={username}
              inDashboard={inDashboard}
            />
          );
      })}
    </div>
  ) : (
    <div className={styles.noProjects}>
      <Empty />
      <h3>This user either has no projects or they are not public</h3>
    </div>
  );
};

export default Projects;
