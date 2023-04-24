"use client";

// Firebase
import { db } from "@config/firebase";
import { getDocs, query, collection, collectionGroup } from "firebase/firestore";

// Styles
import styles from "./Search.module.scss";

// React
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const getUsers = async (searchQuery) => {
  try {
    const documentsRef = await getDocs(collection(db, "users"));
    const documents = await Promise.all(
      documentsRef.docs.map(async (doc) => {
        if (doc.id.toLowerCase().includes(searchQuery.toLowerCase())) {
          const { name, img, bio } = doc.data();
          return { name, img, bio };
        }
        return null;
      }),
    );
    return documents.filter((doc) => doc !== null);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getProjects = async (searchQuery) => {
  try {
    const q = query(collectionGroup(db, "projects"));
    const documentsRef = await getDocs(q);
    const documents = await Promise.all(
      documentsRef.docs.map(async (doc) => {
        if (doc.data().name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return { id: doc.id, ...doc.data() };
        }
        return null;
      }),
    );
    return documents.filter((doc) => doc !== null);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Search = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(
      `/search?q=${e.target.search.value}&users=${e.target.users.checked}&projects=${e.target.projects.checked}`,
    );
  };

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    const projectsQuery = searchParams.has("projects")
      ? searchParams.get("projects") === "true"
        ? true
        : false
      : false;
    const usersQuery = searchParams.has("users") ? (searchParams.get("users") === "true" ? true : false) : false;

    if (searchQuery) {
      if (!projectsQuery && !usersQuery) {
        getProjects(searchQuery).then((res) => setProjects(res));
        getUsers(searchQuery).then((res) => setUsers(res));
      }
      if (projectsQuery) getProjects(searchQuery).then((res) => setProjects(res));
      if (usersQuery) getUsers(searchQuery).then((res) => setUsers(res));
    }
  });

  return (
    <div className={styles.searchPage}>
      <aside className={styles.searchControls}>
        <h2>Search options</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.searchInput}
            type="text"
            name="search"
            placeholder="Search"
            defaultValue={searchParams.has("q") ? searchParams.get("q") : ""}
          />
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="users"
              id="users"
              defaultChecked={searchParams.has("users") ? (searchParams.get("users") === "true" ? true : false) : false}
            />
            <label htmlFor="users">Users</label>
          </div>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="projects"
              id="projects"
              defaultChecked={
                searchParams.has("projects") ? (searchParams.get("projects") === "true" ? true : false) : false
              }
            />
            <label htmlFor="projects">Projects</label>
          </div>
          <button className={styles.searchButton} type="submit">
            Search
          </button>
        </form>
      </aside>
      <div className={styles.result}>
        {(!searchParams.has("users") || searchParams.get("users") === "true") && (
          <div className={styles.result__users}>
            <h3>Users</h3>
            <div className={styles.result__users__list}>
              {users &&
                users.map((user) => (
                  <Link href={`/${user.name}`} key={user.name} className={styles.projectCard}>
                    <div className={styles.leftSide}>
                      <Image src={user.img} alt="User image" fill style={{ objectFit: "cover" }} sizes={"10rem"} />
                    </div>
                    <div className={styles.rightSide}>
                      <h3 className={styles.name}>
                        <div className={styles.label}>Name</div>
                        {user.name}
                      </h3>
                      {user.bio && (
                        <>
                          <div className={styles.label}>Bio</div>
                          <p className={styles.description}>{user.bio}</p>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
        {(!searchParams.has("projects") || searchParams.get("projects") === "true") && (
          <div className={styles.result__projects}>
            <h3>Projects</h3>
            <div className={styles.result__projects__list}>
              {projects &&
                projects.map(
                  (project) =>
                    project.visibility === "public" && (
                      <Link href={`/${project.owner}/${project.name}`} key={project.id} className={styles.projectCard}>
                        <div className={styles.leftSide}>
                          <Image
                            src={project.img}
                            alt="Project image"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes={"10rem"}
                          />
                        </div>
                        <div className={styles.rightSide}>
                          <h3 className={styles.name}>
                            <div className={styles.label}>Project name</div>
                            {project.name}
                          </h3>
                          {project.description && (
                            <>
                              <div className={styles.label}>Project description</div>
                              <p className={styles.description}>{project.description}</p>
                            </>
                          )}
                        </div>
                      </Link>
                    ),
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
