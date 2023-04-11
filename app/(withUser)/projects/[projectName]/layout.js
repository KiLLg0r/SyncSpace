"use client";

// Nextjs
import { usePathname } from "next/navigation";
import Link from "next/link";

// Styles
import styles from "./Project.module.scss";

export default function Layout({ children, params }) {
  const path = usePathname();

  const tabs = [
    { name: "Source code", href: `/projects/${params.projectName}` },
    { name: "Contributors", href: `/projects/${params.projectName}/contributors` },
    { name: "Project details", href: `/projects/${params.projectName}/info` },
    { name: "Upload files", href: `/projects/${params.projectName}/upload` },
    { name: "Start coding", href: `/projects/${params.projectName}/code` },
  ];
  return (
    <div className={styles.projectPage} style={{ padding: path === tabs[4].href && 0 }}>
      {path !== `/projects/${params.projectName}/code` && (
        <div className={styles.header}>
          <h2 className={styles.title}>{params.projectName}</h2>
          <div className={styles.tabs}>
            {tabs.map((tab, index) => {
              return (
                <Link href={tab.href} key={index} className={`${styles.tab} ${path === tab.href && styles.active} `}>
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
