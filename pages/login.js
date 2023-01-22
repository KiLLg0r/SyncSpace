import React from 'react'
import styles from '../styles/Login.module.scss'
import { HiOutlineMail } from "react-icons/hi";
import { GiRingedPlanet } from "react-icons/gi";
import { BiLock } from "react-icons/bi";
import { BsFacebook } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";


function Login() {
  return (
    <div className={styles.background}>
      <div className={styles["login-card-container"]}>
        <div className={styles["login-card"]}>
          <div className={styles["login-card-logo"]}>
            <GiRingedPlanet />
          </div>
          <div className={styles["login-card-header"]}>
            <h1>Sign In</h1>
            <div>Please login to use platform</div>
          </div>
          <form className={styles["login-card-form"]}>
            <div className={styles["form-item"]}>
              <HiOutlineMail className={styles["form-item-icon"]} />
              <input type="text" placeholder="Enter Mail" required autofocus />
            </div>
            <div className={styles["form-item"]}>
              <BiLock className={styles["form-item-icon"]} />
              <input type="password" placeholder="Enter Password" required />
            </div>
            <div className={styles["form-item-other"]}>
              <div className={styles.checkbox}>
                <input type="checkbox" id="rememberMeCheckbox" />
                <label for="rememberMeCheckbox">Remember me</label>
              </div>
              <a href="#">I forgot my password!</a>
            </div>
            <button type="submit">Sign In</button>
          </form>
          <div className={styles["login-card-footer"]}>
            Don't have an account? <a href="#">Create a free account</a>.
          </div>
        </div>
        <div className={styles["login-card-social"]}>
          <div>Other Sign-in Platform</div>
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

  )
}

export default Login