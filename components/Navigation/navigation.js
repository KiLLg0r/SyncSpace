"use client";

import { GiRingedPlanet } from "react-icons/gi";
import { BiSearchAlt } from "react-icons/bi";
import {
  BsFillPersonFill,
  BsChevronDown,
  BsBoxArrowLeft,
  BsFillChatFill,
  BsFillFolderFill,
  BsPersonCircle,
} from "react-icons/bs";
import styles from "./Nav.module.scss";
import { useRef, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { FaCog } from "react-icons/fa";
import Link from "next/link";

const Navigation = () => {
  const buttonRef = useRef(null);
  const chevronRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const toggleDropdown = () => {
    let menuTop =
      chevronRef?.current?.getBoundingClientRect()?.top -
      buttonRef?.current?.getBoundingClientRect()?.top;
    let menuRight =
      chevronRef?.current?.getBoundingClientRect()?.right -
      buttonRef?.current?.getBoundingClientRect()?.right;
    if (open) {
      menuRef.current.style.top = `${menuTop}px`;
      menuRef.current.style.right = `${menuRight}px`;
    } else {
      menuRef.current.style.top = `${buttonRef?.current?.clientHeight + 10}px`;
      menuRef.current.style.right = 0;
    }
    setOpen(!open);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <GiRingedPlanet />
        <div className={styles.name}>
          <span>Sync</span>Space
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.search}>
          <input type="text" placeholder="Search for projects..." />
          <div className={styles.icon}>
            <BiSearchAlt />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        {!currentUser ? (
          <Link href="/login" className={styles.login}>
            Log in
          </Link>
        ) : (
          <div
            className={`${styles.dropdown} ${open && styles.open}`}
            ref={dropdownRef}
          >
            <button ref={buttonRef} onClick={toggleDropdown}>
              <BsFillPersonFill />
              {currentUser?.displayName}
              <div className={styles.chevron} ref={chevronRef}>
                <BsChevronDown />
              </div>
            </button>
            <div ref={menuRef} className={styles.menu}>
              <button>
                <span>
                  <BsPersonCircle />
                </span>
                Profile
              </button>
              <button>
                <span>
                  <BsFillFolderFill />
                </span>
                Projetcs
              </button>
              <button>
                <span>
                  <BsFillChatFill />
                </span>
                Chat
              </button>
              <button>
                <span>
                  <FaCog />
                </span>
                Settings
              </button>
              <button onClick={logout}>
                <span>
                  <BsBoxArrowLeft />
                </span>
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
