// Firebase
import { doc, getDocs, collection } from "firebase/firestore";
import { db } from "@config/firebase";

// Navigation
import Link from "next/link";

const getProjects = async (user) => {
  const projectsRef = await getDocs(collection(db, "users", user, "projects"));
  let projects = [];
  projectsRef.forEach((doc) => {
    projects.push(doc.data());
  });
  return projects;
};

const User = async ({ params }) => {
  const projects = await getProjects(params.username);
  return (
    <>
      {projects.map((project, index) => {
        return (
          <Link key={index} href={`/${params.username}/${project.name}`}>
            {project.name}
          </Link>
        );
      })}
    </>
  );
};

export default User;
