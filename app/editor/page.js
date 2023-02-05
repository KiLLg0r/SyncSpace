"use client";
// Next / Reacts imports
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Monaco Editor import
import Editor from "@monaco-editor/react";

// Yjs imports
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { MonacoBinding } from "../../lib/y-monaco";

// Other imports
import randomColor from "randomcolor";
const { uniqueNamesGenerator, adjectives, colors, animals, languages } = require("unique-names-generator");

// Styles
import styles from "./Editor.module.scss";

// Icons
import { BsFolderFill, BsBoxArrowLeft, BsFiles } from "react-icons/bs";

// Components
import FileExplorer from "@components/File explorer/fileExplorer";
import Tab from "@components/Tab/tab";
import Loading from "@components/Loading/loading";

// Firebase
import { ref, getBytes } from "firebase/storage";
import { storage } from "@config/firebase";

// Utils
import { getLanguage } from "@utils/languages";

let ydocument = new Y.Doc();
let documentList = ydocument.getMap("project-files");
let monacoEditor = null;
let monacoInstance = null;
let provider = null;
let awareness = null;
let monacoBinding = null;

const EditorComponent = () => {
  const [code, setCode] = useState("");
  const [editorRef, setEditorRef] = useState(null);
  const [projectRef, setProjectRef] = useState(ref(storage, "projects/SyncSpace"));
  const [tabs, setTabs] = useState({});
  const tabsContainerRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    monacoEditor = editor;
    monacoInstance = monaco;
    setEditorRef(editor);
  };

  useEffect(() => {
    if (editorRef) {
      try {
        provider = new WebrtcProvider("monaco", ydocument);
        awareness = provider.awareness;

        const randomcolor = randomColor();
        const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

        awareness.setLocalStateField("user", {
          name: randomName,
          color: randomcolor,
        });

        console.log("Connected to room 1");
      } catch (error) {
        throw new Error(error);
      }

      return () => {
        if (provider) {
          provider.disconnect();
          ydocument.destroy();
        }
      };
    }
  }, [editorRef]);

  const bindEditor = (ytext) => {
    if (monacoBinding) monacoBinding.destroy();
    const yUndoManager = new Y.UndoManager(ytext);
    monacoBinding = new MonacoBinding(ytext, monacoEditor.getModel(), new Set([monacoEditor]), awareness, {
      yUndoManager,
    });
  };

  const handleClick = async (docRef) => {
    let content;

    const removedRootName = docRef.fullPath.substring(docRef.fullPath.indexOf("/") + 1);
    const removedProjectName = removedRootName.substring(removedRootName.indexOf("/") + 1);

    const fileExtension = docRef.name.split(".").pop();
    const language = getLanguage(fileExtension);

    let tab = null;
    if (Object.values(tabs).indexOf(true) > -1) tab = Object.keys(tabs).find((key) => tabs[key] === true);

    const newObject = { ...tabs };
    if (tab !== null) newObject[tab] = false;
    newObject[removedProjectName] = true;
    setTabs(newObject);

    monacoInstance.editor.setModelLanguage(monacoInstance.editor.getModels()[0], language);

    if (documentList.has(removedProjectName)) {
      bindEditor(documentList.get(removedProjectName));
    } else {
      await getBytes(docRef)
        .then((res) => {
          const decoder = new TextDecoder();
          content = decoder.decode(res);
        })
        .catch((error) => alert(error));

      const newDoc = new Y.Text("");
      newDoc.applyDelta([{ insert: content }]);
      documentList.set(removedProjectName, newDoc);

      bindEditor(newDoc);
    }
  };

  const changeTab = (name) => {
    const fileExtension = name.split(".").pop();
    const language = getLanguage(fileExtension);

    let tab = null;
    if (Object.values(tabs).indexOf(true) > -1) tab = Object.keys(tabs).find((key) => tabs[key] === true);

    const newObject = { ...tabs };
    if (tab !== null) newObject[tab] = false;
    newObject[name] = true;
    setTabs(newObject);

    monacoInstance.editor.setModelLanguage(monacoInstance.editor.getModels()[0], language);

    bindEditor(documentList.get(name));
  };

  const closeTab = (name) => {
    const newObject = { ...tabs };
    delete newObject[name];
    setTabs(newObject);
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const tabsContainer = tabsContainerRef?.current;
    tabsContainer.scrollLeft += e.deltaY;
  };

  return (
    <div className={styles.editor}>
      {editorRef === null && <Loading />}
      <header className={styles.header}>
        <div className={styles.leftSide}>
          <BsFolderFill className={styles.icon} />
          Project name
        </div>
        <div className={styles.rightSide}>
          <Link href="/">
            Exit editing <BsBoxArrowLeft />
          </Link>
        </div>
      </header>
      <main>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <label>
              <input type="checkbox" id="files" />
              <BsFiles />
              Files
            </label>
          </nav>
          <div className={styles.files}>
            <FileExplorer docRef={projectRef} onClick={handleClick} />
          </div>
        </aside>
        <section>
          <nav className={styles.tabs} onWheel={(e) => handleScroll(e)} ref={tabsContainerRef}>
            {tabs &&
              Object.keys(tabs).map((key, index) => {
                return (
                  <Tab
                    name={key.split("/").pop()}
                    path={key}
                    active={tabs[key]}
                    key={index}
                    onClose={() => closeTab(key)}
                    onClick={() => changeTab(key)}
                  />
                );
              })}
          </nav>
          <div style={{ display: (monacoBinding === null || Object.values(tabs).indexOf(true) < 0) && "none" }}>
            <Editor
              height={"calc(100vh - 7rem)"}
              theme="vs-dark"
              value={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
              className={styles.editor}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditorComponent;
