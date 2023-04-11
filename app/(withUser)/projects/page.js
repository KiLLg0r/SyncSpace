import Projects from "@components/Projects";
import { cookies } from "next/headers";

const ProjectsPage = async () => {
  const cookieStore = cookies();
  const username = cookieStore.get("username");

  return (
    <div style={{ padding: "1.25rem" }}>
      <h2>My projects</h2>
      {username !== undefined && <Projects username={username.value} owner={true} inDashboard={true} />}
    </div>
  );
};

export default ProjectsPage;
