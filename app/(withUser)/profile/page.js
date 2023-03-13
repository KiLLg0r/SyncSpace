"use client";
import ProfileCard from "@components/ProfileCard";

// Auth
import authStore from "@store/authStore";

const Profile = () => {
  const currentUser = authStore((state) => state.currentUser);
  const username = currentUser?.displayName;

  return (
    <div style={{ padding: "1.5rem" }}>
      <ProfileCard username={username} />
    </div>
  );
};

export default Profile;
