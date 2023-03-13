import { doc, getDoc } from "firebase/firestore";
import { db } from "@config/firebase";

import styles from "./ProfileCard.module.scss";

import Image from "next/image";

import { useEffect, useState } from "react";

const getUserData = async (username) => {
  const docRef = doc(db, "users", username);
  const docData = await getDoc(docRef);
  if (docData.exists())
    return {
      img: docData.data().img,
      name: docData.data().name,
      bio: docData.data().bio,
    };
  return {
    img: "",
    name: "",
    bio: "",
  };
};

const ProfileCard = ({ username }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (Object.keys(data).length === 0)
      getUserData(username).then((res) => setData(res));
  }, [data]);

  return (
    <div className={styles.profileCard}>
      <div className={styles.img}>
        {console.log(data)}
        <Image
          src={data.img}
          fill={true}
          alt={`${username}'s profile image`}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.text}>
        <div className={styles.name}>{data.name}</div>
        <div className={styles.bio}>{data.bio}</div>
      </div>
    </div>
  );
};
export default ProfileCard;
