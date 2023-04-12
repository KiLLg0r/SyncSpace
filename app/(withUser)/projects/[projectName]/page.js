import { cookies } from "next/headers";

// Components
import SourceCode from "@components/SourceCode";

const Project = ({ params }) => {
  const cookieStore = cookies();
  const username = cookieStore.get("username");
  return <SourceCode username={username?.value} projectname={params.projectName} />;
};

export default Project;
