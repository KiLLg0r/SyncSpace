"use client";
// React / Next imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// Firebase
import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";

// Icons
import { BsLockFill, BsPeopleFill } from "react-icons/bs";

// Page styles
import styles from "./New.module.scss";

const New = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectVisibility, setProjectVisibility] = useState("public");

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    await setDoc(doc(db, "tests", projectName), {
      name: projectName,
      description: projectDesc,
      visibility: projectVisibility,
    });

    router.push(`/`);
  };

  return (
    <form className={styles.newProject} onSubmit={onSubmit}>
      <h2 className={styles.mainTitle}>Create new project</h2>
      <p className={styles.titleDesc}>
        A project will contain all project files, description and other information about it.
      </p>

      <section className={styles.projectSection}>
        <label className={styles.inputLabel}>
          <div>
            Project name
            <span className={styles.require}>*</span>
          </div>
          <input type="text" onChange={(e) => setProjectName(e.target.value)} required />
        </label>

        <label className={styles.inputLabel}>
          <div>
            Description
            <span className={styles.optional}>(optional)</span>
          </div>
          <textarea rows="10" onChange={(e) => setProjectDesc(e.target.value)}></textarea>
        </label>
      </section>

      <section className={styles.visibility}>
        <h4>
          Project visibility<span className={styles.require}>*</span>
        </h4>

        <label htmlFor="publicVisibility" className={styles.radioLabel}>
          <input
            type="radio"
            name="visibility"
            checked
            value="public"
            id="publicVisibility"
            onChange={(e) => setProjectVisibility(e.target.value)}
          />
          <div className={styles.icon}>
            <BsPeopleFill />
          </div>
          <div className={styles.label}>
            <div>Public</div>
            <div className={styles.shortDesc}>Anyone on the internet can see this project.</div>
          </div>
        </label>

        <label htmlFor="privateVisibility" className={styles.radioLabel}>
          <input
            type="radio"
            name="visibility"
            value="private"
            id="privateVisibility"
            onChange={(e) => setProjectVisibility(e.target.value)}
          />
          <div className={styles.icon}>
            <BsLockFill />
          </div>
          <div className={styles.label}>
            <div>Private</div>
            <div className={styles.shortDesc}>Only you can see this project and choose who else can see it.</div>
          </div>
        </label>
      </section>
      <button className={styles.createProject}>Create project</button>
    </form>
  );
};

export default New;
