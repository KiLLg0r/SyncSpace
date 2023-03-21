import { db } from "@config/firebase";
import { getDocs, collection } from "firebase/firestore";

import ProjectCard from "@components/ProjectCard";

import styles from "./Projects.module.scss";

import Empty from "@public/empty.svg";

const getProjects = async (username) => {
  const documentsRef = await getDocs(collection(db, "users", username, "projects"));
  const documents = documentsRef.docs.map((doc) => doc.data());
  return documents;
};

const Projects = async ({ username }) => {
  const projects = await getProjects(username);
  return projects.length > 0 ? (
    <div className={styles.projects}>
      {projects.map((project) => {
        if (project.visibility === "public")
          return <ProjectCard key={project.lastModified.seconds} projectData={project} username={username} />;
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
