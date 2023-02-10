"use client";

import React, { useRef } from "react";
import styles from "./Register.module.scss";
import { HiOutlineMail } from "react-icons/hi";
import { GiRingedPlanet } from "react-icons/gi";
import { BiLock } from "react-icons/bi";
import { BsFacebook } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { useAuth } from "@context/AuthContext";
import { useRouter } from "next/navigation";

function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      alert("Password do not match");
      return;
    }

    try {
      await register(emailRef?.current?.value, passwordRef?.current?.value);
      router.push("/");
    } catch (error) {
      alert(error);
    }
  };

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
          <form className={styles["login-card-form"]} onSubmit={handleSubmit}>
            <div className={styles["form-item"]}>
              <HiOutlineMail className={styles["form-item-icon"]} />
              <input
                type="text"
                placeholder="Enter Mail"
                required
                autoFocus
                ref={emailRef}
              />
            </div>
            <div className={styles["form-item"]}>
              <BiLock className={styles["form-item-icon"]} />
              <input
                type="password"
                placeholder="Enter Password"
                required
                ref={passwordRef}
              />
            </div>
            <div className={styles["form-item"]}>
              <BiLock className={styles["form-item-icon"]} />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                ref={confirmPasswordRef}
              />
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
