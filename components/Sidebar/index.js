"use client";

// Styles
import styles from "./Sidebar.module.scss";

// Icons
import { GiRingedPlanet } from "react-icons/gi";
import {
  BsHouse,
  BsFolder,
  BsChatRightDots,
  BsBoxArrowLeft,
  BsPersonCircle,
  BsChevronUp,
  BsPlus,
} from "react-icons/bs";
import { HiOutlineCog8Tooth } from "react-icons/hi2";

// React / Next
import { useState } from "react";

// Auth store
import authStore from "@store/authStore";

// Navigation
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const [open, setOpen] = useState({
    sidebar: true,
    projects: false,
  });

  const links = [
    { name: "Home", icon: <BsHouse />, path: "/home" },
    { name: "Profile", icon: <BsPersonCircle />, path: "/profile" },
    { name: "Projects", icon: <BsFolder />, path: "/projects" },
    { name: "Messages", icon: <BsChatRightDots />, path: "/messages" },
    { name: "Settings", icon: <HiOutlineCog8Tooth />, path: "/settings" },
  ];

  const path = usePathname();

  const logout = authStore((state) => state.logout);

  const toggleSidebar = () => setOpen({ ...open, sidebar: !open.sidebar });
  const toggleProjects = () => setOpen({ ...open, projects: !open.projects });

  return (
    <div className={`${styles.sidebar} ${!open.sidebar ? styles.closed : ""}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <GiRingedPlanet />
          <div className={styles.name}>
            <span>Sync</span>Space
          </div>
        </div>
        <div className={styles.hamburgerMenu} onClick={toggleSidebar}>
          <div className={styles.hline}></div>
          <div className={styles.hline}></div>
          <div className={styles.hline}></div>
        </div>
      </div>
      <div className={styles.links}>
        {links.map((link, i) => {
          return (
            <Link href={link.path} className={`${styles.link} ${link.path === path ? styles.active : ""}`} key={i}>
              <div className={styles.icon}>{link.icon}</div>
              <div className={styles.text}>{link.name}</div>
              <div className={`${styles.tooltip} ${link.path === path ? styles.active : ""}`}>
                <div className={styles.tooltipText}>{link.name}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className={styles.line}></div>

      <div className={styles.projects}>
        <div className={styles.dropdown}>
          <div className={styles.title} onClick={toggleProjects}>
            Projects
          </div>
          <div className={styles.dropdown__icons}>
            <Link href="/new" className={styles.dropdown__icon}>
              <BsPlus />
            </Link>
            <div className={styles.dropdown__icon} onClick={toggleProjects}>
              <BsChevronUp style={{ transform: open.projects && "rotate(180deg)" }} />
              <div className={styles.tooltip}>
                <div className={styles.tooltipText}>{open.projects ? "Hide projects" : "Show projects"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.dropdownContent}></div>
      </div>

      <div className={styles.footer}>
        <button onClick={logout} className={styles.logOut}>
          <div className={styles.icon}>
            <BsBoxArrowLeft />
          </div>
          <div className={styles.text}>Log Out</div>
          <div className={`${styles.tooltip} ${styles.logOutTooltip}`}>
            <div className={styles.tooltipText}>Log out</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
