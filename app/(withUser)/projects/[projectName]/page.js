"use client";

// Components
import SourceCode from "@components/SourceCode";

// Store
import useAuthStore from "@store/useAuthStore";

const Project = ({ params }) => {
  const projects = useAuthStore((state) => state.projects);
  const project = projects.find((o) => o.name === params.projectName);

  return <SourceCode username={project.owner} projectname={params.projectName} />;
};

export default Project;
