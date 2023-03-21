import Projects from "@components/Projects";

const User = ({ params }) => {
  return <Projects username={params.username} />;
};

export default User;
