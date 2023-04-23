"use client";

import styles from "./Info.module.scss";
import errorStyles from "@styles/Error.module.css";

// Auth store
import useAuthStore from "@store/useAuthStore";

// React
import { useEffect, useState, useRef } from "react";

// Firebase
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, storage } from "@config/firebase";
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

// React hooks form
import { useForm } from "react-hook-form";

// Animation
import { motion, AnimatePresence } from "framer-motion";

// Next image
import Image from "next/image";

// Placeholder image
import placeholder from "placeholder.js";

// Icons
import { BsLockFill, BsPeopleFill } from "react-icons/bs";

const Info = ({ params }) => {
  const projects = useAuthStore((state) => state.projects);
  const project = projects.find((o) => o.name === params.projectName);
  const username = project.owner;

  const [projectData, setProjectData] = useState({});

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const imageInputRef = useRef(null);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { projectName, projectDesc, visibility } = data;

    const storageRef = ref(storage, `/users/${username}/projects/${projectName}`);

    if (image) await uploadBytes(storageRef, image);

    getDownloadURL(storageRef)
      .then(async (url) => {
        await updateDoc(doc(db, "users", `${username}/projects/${projectName}`), {
          name: projectName,
          description: projectDesc,
          visibility: visibility,
          img: url,
        })
          .then()
          .catch((error) => alert(error));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const getProjectData = async () => {
      const projectRef = doc(db, "users", username, "projects", params.projectName);
      const projectSnapshot = await getDoc(projectRef);
      if (projectSnapshot.exists()) return projectSnapshot.data();
      return {};
    };

    if (Object.keys(projectData).length === 0)
      getProjectData().then((res) => {
        setValue("projectName", res?.name);
        setValue("projectDesc", res?.description);
        setValue("visibility", res?.visibility);
        setProjectData(res);
      });
  }, [params.projectName, projectData, setValue, username]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  return (
    <form className={styles.editProject} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.mainTitle}>Edit project details</h2>
      <p className={styles.titleDesc}>You can modify the name, the description, the image or the visibility</p>

      <section className={styles.projectSection}>
        <div className={styles.imageContainer}>
          <div
            className={styles.imageEdit}
            onClick={(e) => {
              e.preventDefault();
              imageInputRef.current.click();
            }}
          >
            <Image
              alt="Project image"
              fill={true}
              style={{ objectFit: "cover" }}
              src={preview ? preview : projectData.img}
              sizes={"10rem"}
            />
          </div>
          <h4 className={styles.imageEditLabel}>Select an image for your project</h4>
          <input
            type="file"
            style={{ display: "none" }}
            ref={imageInputRef}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.type.substring(0, 5) === "image") setImage(file);
              else setImage(null);
            }}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.inputLabel}>
            <div>
              <label htmlFor="projectName">Project name</label>
              <span className={styles.require}>*</span>
            </div>
            <input
              type="text"
              {...register("projectName", {
                required: true,
                min: 3,
              })}
              aria-invalid={errors.projectName ? "true" : "false"}
            />
            <AnimatePresence>
              {errors.projectName?.type === "required" && (
                <motion.p
                  role="alert"
                  className={errorStyles.error}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                >
                  A project name is required
                </motion.p>
              )}
            </AnimatePresence>
          </label>

          <label className={styles.inputLabel}>
            <div>
              <label htmlFor="projectDesc">Description</label>
              <span className={styles.optional}>(optional)</span>
            </div>
            <textarea {...register("projectDesc")} aria-invalid={errors.projectDesc ? "true" : "false"} />
            {errors.projectDesc && <p>{errors.projectDesc?.message}</p>}
          </label>
        </div>
      </section>

      <section className={styles.visibility}>
        <h4>
          Project visibility<span className={styles.require}>*</span>
        </h4>

        <div>
          <label htmlFor="visibilityPublic" className={styles.radioLabel}>
            <input id="visibilityPublic" {...register("visibility", { required: true })} type="radio" value="public" />
            <div className={styles.icon}>
              <BsPeopleFill />
            </div>
            <div className={styles.label}>
              <div>Public</div>
              <div className={styles.shortDesc}>Anyone on the internet can see this project.</div>
            </div>
          </label>

          <label htmlFor="visibilityPrivate" className={styles.radioLabel}>
            <input
              id="visibilityPrivate"
              {...register("visibility", { required: true })}
              type="radio"
              value="private"
            />
            <div className={styles.icon}>
              <BsLockFill />
            </div>
            <div className={styles.label}>
              <div>Private</div>
              <div className={styles.shortDesc}>Only you can see this project and choose who else can see it.</div>
            </div>
          </label>
        </div>

        <AnimatePresence>
          {errors.visibility?.type === "required" && (
            <motion.p
              role="alert"
              className={errorStyles.error}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              You need to choose the project to be either public or private
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      <button className={styles.createProject}>Save changes</button>
    </form>
  );
};

export default Info;
