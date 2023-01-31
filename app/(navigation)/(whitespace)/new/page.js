"use client";

import styles from "./New.module.scss";
import { BsLockFill, BsPeopleFill } from "react-icons/bs";
import { useState } from "react";

const New = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectVisibility, setProjectVisibility] = useState("public");

  return (
    <form className={styles.newProject}>
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
          <input type="text" onChange={(e) => setProjectName(e.target.value)} />
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

        <div className={styles.radioLabel}>
          <input
            type="radio"
            name="visibility"
            checked
            value="public"
            onChange={(e) => setProjectVisibility(e.target.value)}
          />
          <div className={styles.icon}>
            <BsPeopleFill />
          </div>
          <div className={styles.label}>
            <div>Public</div>
            <div className={styles.shortDesc}>Anyone on the internet can see this project.</div>
          </div>
        </div>

        <div className={styles.radioLabel}>
          <input
            type="radio"
            name="visibility"
            value="private"
            onChange={(e) => setProjectVisibility(e.target.value)}
          />
          <div className={styles.icon}>
            <BsLockFill />
          </div>
          <div className={styles.label}>
            <div>Private</div>
            <div className={styles.shortDesc}>Only you can see this project and choose who else can see it.</div>
          </div>
        </div>
      </section>
      <button className={styles.createProject}>Create project</button>
    </form>
  );
};

export default New;
