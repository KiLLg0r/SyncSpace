"use client";

import { GiRingedPlanet } from "react-icons/gi";
import { BiSearchAlt } from "react-icons/bi";
import { BsFillPersonFill, BsChevronDown, BsChevronUp } from "react-icons/bs";
import styles from "./Nav.module.scss";
import { useRef, useState, useEffect } from "react";

const Navigation = () => {
  const buttonRef = useRef(null);
  const chevronRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    let menuTop = chevronRef?.current?.getBoundingClientRect()?.top - buttonRef?.current?.getBoundingClientRect()?.top;
    let menuRight = chevronRef?.current?.getBoundingClientRect()?.right - buttonRef?.current?.getBoundingClientRect()?.right;
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
        <div className={`${styles.dropdown} ${open ? styles.open : ''}`} ref={dropdownRef}>
          <button ref={buttonRef} onClick={toggleDropdown}>
            <BsFillPersonFill />
            Username
            <div className={styles.chevron} ref={chevronRef}>
              <BsChevronDown />
            </div>
          </button>
          <div ref={menuRef} className={styles.menu}>
            <button>
              <span> build </span>
              Profile
            </button>
            <button>
              <span> build </span>
              Chat
            </button>
            <button>
              <span> build </span>
              Settings
            </button>
            <button>
              <span> build </span>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
