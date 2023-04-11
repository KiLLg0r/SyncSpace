// Components
import SourceCode from "@components/SourceCode";
import ProjectData from "@components/ProjectData";
import { SideProjectData } from "@components/ProjectData";

// Firebase
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@config/firebase";
import { ref, list } from "firebase/storage";

// SVG
import Empty from "@public/empty.svg";

const getProjectData = async (path) => {
  const { username, projectname } = path;
  const docRef = doc(db, "users", username, "projects", projectname);
  const docSnap = await getDoc(docRef);

  return docSnap.data() || null;
};

const projectHasFiles = async (path) => {
  const { username, projectname } = path;
  const projectRef = ref(storage, `users/${username}/${projectname}`);
  const res = await list(projectRef, { maxResults: 1 });
  return res.items.length > 0 || res.prefixes.length > 0;
};

const Project = async ({ params }) => {
  const projectData = await getProjectData(params);
  const hasFiles = await projectHasFiles(params);

  const styles = { display: "flex", gap: "1rem" };

  return (
    <>
      <ProjectData projectData={projectData} />
      <main style={styles}>
        <div style={{ flex: "2" }}>
          {hasFiles ? (
            <SourceCode username={params.username} projectname={params.projectname} />
          ) : (
            <div className={styles.noFiles}>
              <Empty />
              <p>Currently this project does not contain any files or folders.</p>
            </div>
          )}
        </div>
        <SideProjectData projectData={projectData} style={{ flex: "1" }} />
      </main>
    </>
  );
};

export default Project;
