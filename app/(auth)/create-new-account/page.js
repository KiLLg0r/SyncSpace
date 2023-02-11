"use client";

// React / Next
import React from "react";
import { useRouter } from "next/navigation";

// Styles
import styles from "./Register.module.scss";
import errorStyles from "@styles/Error.module.css";

// Icons
import { HiOutlineMail } from "react-icons/hi";
import { GiRingedPlanet } from "react-icons/gi";
import { BiLock } from "react-icons/bi";
import { BsFacebook, BsGoogle } from "react-icons/bs";

// Auth context
import { useAuth } from "@context/AuthContext";

// React hooks form
import { useForm } from "react-hook-form";

// Animation
import { motion, AnimatePresence } from "framer-motion";

// Error validation
import validateError from "@utils/errors";

function Register() {
  const { createAccount } = useAuth();
  const router = useRouter();

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    if (data.password !== data.passwordConfirm) {
      setError("passwordConfirm", { type: "custom", message: "The passwords do not match" });
      return;
    }

    try {
      await createAccount(data.email, data.password);
      router.push("/");
    } catch (error) {
      const validatedError = validateError(error.code);
      if (validatedError.type === "email") setError("email", { type: "custom", message: validatedError.error });
      else if (validatedError.type === "password")
        setError("password", { type: "custom", message: validatedError.error });
    }
  };

  console.log(errors);

  return (
    <div className={styles.background}>
      <div className={styles["login-card-container"]}>
        <div className={styles["login-card"]}>
          <div className={styles["login-card-logo"]}>
            <GiRingedPlanet />
          </div>
          <div className={styles["login-card-header"]}>
            <h1>Create Account</h1>
            <div>Please register to use platform</div>
          </div>
          <form className={styles["login-card-form"]} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles["form-item"]}>
              <HiOutlineMail className={styles["form-item-icon"]} />
              <input
                autoFocus={true}
                placeholder="Enter your email"
                type="text"
                aria-invalid={errors.email ? "true" : "false"}
                {...register("email", { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i })}
              />
              <AnimatePresence>
                {errors.email?.type === "required" && (
                  <motion.p
                    role="alert"
                    className={`${errorStyles.error} ${errorStyles.authError}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                  >
                    The email is required
                  </motion.p>
                )}
                {errors.email?.type === "pattern" && (
                  <motion.p
                    role="alert"
                    className={`${errorStyles.error} ${errorStyles.authError}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                  >
                    Enter a valid email address
                  </motion.p>
                )}
                {errors.email?.type === "custom" && (
                  <motion.p
                    role="alert"
                    className={`${errorStyles.error} ${errorStyles.authError}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                  >
                    {errors.email?.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className={styles["form-item"]}>
              <BiLock className={styles["form-item-icon"]} />
              <input
                placeholder="Enter your password"
                type="password"
                aria-invalid={errors.username ? "true" : "false"}
                {...register("password", { required: true })}
              />
              <AnimatePresence>
                {errors.password?.type === "required" && (
                  <motion.p
                    role="alert"
                    className={`${errorStyles.error} ${errorStyles.authError}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                  >
                    The password is required
                  </motion.p>
                )}
                {errors.password?.type === "custom" && (
                  <motion.p
                    role="alert"
                    className={`${errorStyles.error} ${errorStyles.authError}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                  >
                    {errors.password?.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className={styles["form-item"]}>
              <BiLock className={styles["form-item-icon"]} />
              <input
                placeholder="Confirm your password"
                type="password"
                aria-invalid={errors.username ? "true" : "false"}
                {...register("passwordConfirm", { required: true })}
              />
              <AnimatePresence>
                {errors.passwordConfirm?.type === "required" && (
                  <motion.p
                    role="alert"
                    className={`${errorStyles.error} ${errorStyles.authError}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                  >
                    The confirmation of the password is required
                  </motion.p>
                )}
                {errors.passwordConfirm?.type === "custom" && (
                  <motion.p
                    role="alert"
                    className={`${errorStyles.error} ${errorStyles.authError}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                  >
                    {errors.passwordConfirm?.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <button type="submit">Sign Up</button>
          </form>
          <div className={styles["login-card-footer"]}>
            Already have an account? <a href="../login">Log in here!</a>
          </div>
        </div>
        <div className={styles["login-card-social"]}>
          <div>You can also sign up through</div>
          <div className={styles["login-card-social-btn"]}>
            <a href="#">
              <BsFacebook />
            </a>
            <a href="#">
              <BsGoogle />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
