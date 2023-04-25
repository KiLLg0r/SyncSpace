"use client";

// Styles
import styles from "./Sidebar.module.scss";

// Icons
import { GiRingedPlanet } from "react-icons/gi";
import { BsFolder, BsBoxArrowLeft, BsPersonCircle, BsChevronUp, BsPlus } from "react-icons/bs";

// React / Next
import { useState, useEffect } from "react";

// Auth store
import useAuthStore from "@store/useAuthStore";

// Navigation
import { usePathname } from "next/navigation";
import Link from "next/link";

// Firebase
import { getDocs, query, limit, startAfter, collectionGroup, where } from "firebase/firestore";
import { db } from "@config/firebase";
import Image from "next/image";

const Sidebar = () => {
  const [projects, setProjects] = useState([]);
  const [lastProject, setLastProject] = useState(null);
  const [areMoreProject, setAreMoreProject] = useState(false);
  const [open, setOpen] = useState({
    sidebar: true,
    projects: false,
  });

  const links = [
    { name: "My profile", icon: <BsPersonCircle />, path: "/profile" },
    { name: "My projects", icon: <BsFolder />, path: "/projects" },
  ];

  const path = usePathname();

  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const username = currentUser?.displayName;

  const toggleSidebar = () => setOpen({ ...open, sidebar: !open.sidebar });
  const toggleProjects = () => setOpen({ ...open, projects: !open.projects });

  const loadMoreProjects = async () => {
    const next = query(
      collectionGroup(db, "projects"),
      where("contributors", "array-contains", username),
      limit(5),
      startAfter(lastProject),
    );
    const documentSnapshots = await getDocs(next);

    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

    let docs = [];
    documentSnapshots.forEach((doc) => docs.push(doc.data()));

    setProjects((oldDocs) => [...oldDocs, ...docs]);
    setLastProject(lastVisible);
    setAreMoreProject(documentSnapshots.docs.length >= 5);
  };

  useEffect(() => {
    const getProjects = async () => {
      const first = query(collectionGroup(db, "projects"), where("contributors", "array-contains", username), limit(5));
      const documentSnapshots = await getDocs(first);

      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

      let docs = [];
      documentSnapshots.forEach((doc) => docs.push(doc.data()));

      setProjects(docs);
      setLastProject(lastVisible);
      setAreMoreProject(documentSnapshots.docs.length >= 5);
    };

    if (username) getProjects();
  }, [username]);

  return (
    <div className={`${styles.sidebar} ${!open.sidebar ? styles.closed : ""}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <GiRingedPlanet />
          <Link href="/">
            <div className={styles.name}>
              <span>Sync</span>Space
            </div>
          </Link>
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
        {open.projects && (
          <div className={styles.dropdownContent}>
            {projects.length > 0 &&
              projects.map((project) => (
                <Link href={`/projects/${project.name}`} key={project.lastModified} className={styles.project}>
                  <div className={styles.img}>
                    <Image src={project.img} alt={`${project.name} image`} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className={styles.text}>{project.name}</div>
                  <div className={styles.tooltip}>
                    <div className={styles.tooltipText}>{project.name}</div>
                  </div>
                </Link>
              ))}

            {areMoreProject && (
              <button type="button" className={styles.loadMore} onClick={loadMoreProjects}>
                Load more
              </button>
            )}
          </div>
        )}
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
