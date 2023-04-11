import ProfileCard from "@components/ProfileCard";
import { cookies } from "next/headers";

const Profile = () => {
  const cookieStore = cookies();
  const username = cookieStore.get("username");

  return (
    <div style={{ padding: "1.5rem" }}>
      <ProfileCard username={username.value} />
    </div>
  );
};

export default Profile;
