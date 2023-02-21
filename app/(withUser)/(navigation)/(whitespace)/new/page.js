"use client";
// React / Next imports
import { useRouter } from "next/navigation";

// Firebase
import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";

// Icons
import { BsLockFill, BsPeopleFill } from "react-icons/bs";

// Page styles
import styles from "./New.module.scss";
import errorStyles from "@styles/Error.module.css";

// Auth store
import authStore from "@store/authStore";

// React hooks form
import { useForm } from "react-hook-form";

// Animation
import { motion, AnimatePresence } from "framer-motion";

const New = () => {
  const router = useRouter();

  const currentUser = authStore((state) => state.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await setDoc(doc(db, `projects/${currentUser.displayName}`, data.projectName), {
      name: data.projectName,
      description: data.projectDesc,
      visibility: data.visibility,
    });

    router.push(`/${currentUser.displayName}/${data.projectName}`);
  };

  return (
    <form className={styles.newProject} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.mainTitle}>Create new project</h2>
      <p className={styles.titleDesc}>
        A project will contain all project files, description and other information about it.
      </p>

      <section className={styles.projectSection}>
        <label className={styles.inputLabel}>
          <div>
            <label htmlFor="projectName">Project name</label>
            <span className={styles.require}>*</span>
          </div>
          <input
            type="text"
            {...register("projectName", { required: true, min: 3 })}
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
          <textarea {...register("projectDesc", {})} aria-invalid={errors.projectDesc ? "true" : "false"} />
          {errors.projectDesc && <p>{errors.projectDesc?.message}</p>}
        </label>
      </section>

      <section className={styles.visibility}>
        <h4>
          Project visibility<span className={styles.require}>*</span>
        </h4>

        <div>
          <label htmlFor="visibility" className={styles.radioLabel}>
            <input {...register("visibility", { required: true })} type="radio" value="public" />
            <div className={styles.icon}>
              <BsPeopleFill />
            </div>
            <div className={styles.label}>
              <div>Public</div>
              <div className={styles.shortDesc}>Anyone on the internet can see this project.</div>
            </div>
          </label>

          <label htmlFor="visibility" className={styles.radioLabel}>
            <input {...register("visibility", { required: true })} type="radio" value="private" />
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
      <button className={styles.createProject}>Create project</button>
    </form>
  );
};

export default New;
