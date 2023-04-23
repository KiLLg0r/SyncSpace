"use client";

// Nextjs
import { usePathname } from "next/navigation";
import Link from "next/link";

// Styles
import styles from "./Project.module.scss";

// Store
import useAuthStore from "@store/useAuthStore";

import Empty from "@public/empty.svg";

export default function Layout({ children, params }) {
  const path = usePathname();
  const projects = useAuthStore((state) => state.projects);

  const tabs = [
    { name: "Source code", href: `/projects/${params.projectName}` },
    { name: "Contributors", href: `/projects/${params.projectName}/contributors` },
    { name: "Project details", href: `/projects/${params.projectName}/info` },
    { name: "Upload files", href: `/projects/${params.projectName}/upload` },
    { name: "Start coding", href: `/projects/${params.projectName}/code` },
  ];

  return (
    <div className={styles.projectPage} style={{ padding: path === tabs[4].href && 0 }}>
      {projects.findIndex((o) => o.name === params.projectName) !== -1 ? (
        <>
          {path !== `/projects/${params.projectName}/code` && (
            <div className={styles.header}>
              <h2 className={styles.title}>{params.projectName}</h2>
              <div className={styles.tabs}>
                {tabs.map((tab, index) => {
                  return (
                    <Link
                      href={tab.href}
                      key={index}
                      className={`${styles.tab} ${path === tab.href && styles.active} `}
                    >
                      {tab.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          {children}
        </>
      ) : (
        <div className={styles.noProjects}>
          <Empty />
          <h3>This project could not be found or did not exist</h3>
        </div>
      )}
    </div>
  );
}
