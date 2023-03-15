"use client";

import styles from "./Home.module.scss";

import { db } from "@config/firebase";
import { collection, getDocs } from "firebase/firestore";

import authStore from "@store/authStore";
import { useEffect, useState } from "react";

import ProjectCard from "@components/ProjectCard";

const getLatestProject = async (username) => {
  const docsRef = await getDocs(collection(db, "users", username, "projects"));

  let mostRecent = {
    timestamp: docsRef.docs[0]._document.version.timestamp.seconds,
    index: 0,
  };

  docsRef.docs.forEach((doc, i) => {
    if (doc._document.version.timestamp.seconds > mostRecent.timestamp)
      mostRecent = { timestamp: doc._document.version.timestamp.seconds, index: i };
  });

  return docsRef.docs[mostRecent.index].data();
};

const Home = () => {
  const [data, setData] = useState({});
  const currentUser = authStore((state) => state.currentUser);

  useEffect(() => {
    if (Object.keys(data).length === 0) getLatestProject(currentUser.displayName).then((data) => setData(data));
  }, [currentUser, data]);

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Recent project</h2>
      {Object.keys(data).length !== 0 && <ProjectCard username={currentUser.displayName} projectData={data} />}
    </div>
  );
};

export default Home;
