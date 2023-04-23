"use client";

// Icons
import { GiRingedPlanet } from "react-icons/gi";
import { BiSearchAlt } from "react-icons/bi";
import { BsFillPersonFill, BsChevronDown, BsBoxArrowLeft, BsFillGrid1X2Fill } from "react-icons/bs";

// Styles
import styles from "./Nav.module.scss";

// React / Next
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Auth store
import useAuthStore from "@store/useAuthStore";

const Navigation = () => {
  const buttonRef = useRef(null);
  const chevronRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const toggleDropdown = () => {
    let menuTop = chevronRef?.current?.getBoundingClientRect()?.top - buttonRef?.current?.getBoundingClientRect()?.top;
    let menuRight =
      chevronRef?.current?.getBoundingClientRect()?.right - buttonRef?.current?.getBoundingClientRect()?.right;
    if (open) {
      menuRef.current.style.top = `${menuTop}px`;
      menuRef.current.style.right = `${menuRight}px`;
    } else {
      menuRef.current.style.top = `${buttonRef?.current?.clientHeight + 10}px`;
      menuRef.current.style.right = 0;
    }
    setOpen(!open);
  };

  useEffect(() => {
    const documentClick = () => {
      if (dropdownRef.current && open) setOpen(false);
    };
    document.addEventListener("click", documentClick);
    return () => document.removeEventListener("click", documentClick);
  }, [open]);

  return (
    <nav className={styles.nav}>
      <Link href="/">
        <div className={styles.left}>
          <GiRingedPlanet />
          <div className={styles.name}>
            <span>Sync</span>Space
          </div>
        </div>
      </Link>
      <div className={styles.center}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search for projects or users..."
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/search?q=${search}`);
              else if (e.key === "Esc") setSearch("");
            }}
          />
          <div className={styles.icon} onClick={() => router.push(`/search?q=${search}`)}>
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
          <div className={`${styles.dropdown} ${open && styles.open}`} ref={dropdownRef}>
            <button ref={buttonRef} onClick={toggleDropdown}>
              <BsFillPersonFill />
              {currentUser?.displayName}
              <div className={styles.chevron} ref={chevronRef}>
                <BsChevronDown />
              </div>
            </button>
            <div ref={menuRef} className={styles.menu}>
              <Link href="/" className={styles.menuItem}>
                <button>
                  <BsFillGrid1X2Fill />
                  Dashboard
                </button>
              </Link>
              <button onClick={logout} className={styles.menuItem}>
                <BsBoxArrowLeft />
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
