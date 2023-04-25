import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@config/firebase";

import styles from "./ProfileCard.module.scss";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import authStore from "@store/authStore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { BsPencilSquare } from "react-icons/bs";

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

const ProfileCard = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [data, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const imageInputRef = useRef(null);
  const bioRef = useRef(null);

  const currentUser = authStore((state) => state.currentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bio = bioRef.current.value;
    const userRef = doc(db, "users", currentUser.displayName);

    await updateDoc(userRef, {
      bio: bio,
    });

    const storageRef = ref(
      storage,
      `/users/${currentUser.displayName}/projects/${currentUser.displayName}`
    );

    if (image) {
      await uploadBytes(storageRef, image);

      getDownloadURL(storageRef)
        .then(async (url) => {
          await updateDoc(userRef, {
            img: url,
          }).then(() => {
            setData({ ...data, img: url });
          });
        })
        .catch((error) => console.log(error));
    }
    setData({ ...data, bio: bio });
    setIsEditing(false);
  };

  const imgRefClick = (e) => {
    e.preventDefault();
    imageInputRef.current.click();
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  useEffect(() => {
    if (Object.keys(data).length === 0)
      getUserData(currentUser.displayName).then((res) => setData(res));
  }, [data, currentUser]);

  return (
    <div className={styles.profileCard}>
      <div className={styles.img}>
        <div className={styles.imageContainer}>
          <div
            className={`${isEditing && styles.img} ${styles.imageEdit}`}
            onClick={imgRefClick}
          >
            <Image
              src={preview.length > 0 ? preview : data.img}
              fill={true}
              alt={`${currentUser.displayName}'s profile image`}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            className={styles.icon}
            style={{ visibility: isEditing && "visible" }}
            onClick={imgRefClick}
          >
            <BsPencilSquare />
          </div>
          <input
            type="file"
            style={{ display: "none" }}
            ref={imageInputRef}
            disabled={!isEditing}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.type.substring(0, 5) === "image") setImage(file);
              else setImage(null);
            }}
          />
        </div>
      </div>
      <form className={styles.text} key={isEditing} onSubmit={handleSubmit}>
        <div className={styles.name}>{data.name} </div>
        <textarea
          disabled={!isEditing}
          defaultValue={data.bio}
          onChange={(e) => {
            e.target.style.height = "inherit";
            e.target.style.height = `${e.target.scrollHeight + 1}px`;
          }}
          ref={bioRef}
        ></textarea>
        {currentUser && (
          <div className={styles.buttons}>
            {!isEditing && (
              <button
                className={styles.edit}
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button className={styles.save} type="submit">
                  Save
                </button>
                <button
                  className={styles.cancel}
                  type="button"
                  onClick={() => {
                    setPreview("");
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
export default ProfileCard;
