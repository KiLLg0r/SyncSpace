"use client";
// Next / Reacts imports
import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { BsFolderFill, BsBoxArrowLeft, BsFiles, BsFolderPlus, BsFilePlus } from "react-icons/bs";

// Components
import FileExplorer from "@components/File explorer/fileExplorer";
import Tab from "@components/Tab/tab";
import Loading from "@components/Loading/loading";
import Modal from "@components/Modal/modal";

// Firebase
import { ref, getBytes, uploadString, deleteObject, listAll, uploadBytes } from "firebase/storage";
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
  const [focus, setFocus] = useState({ path: "projects/SyncSpace/" });
  const [newUpdate, updateState] = useState();
  const [newFileModal, setNewFileModal] = useState(false);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [rightClick, setRightClick] = useState(false);
  const [xy, setXY] = useState({ x: 0, y: 0 });
  const [deletedPath, setDeletedPath] = useState({ path: "", folder: false });

  const tabsContainerRef = useRef(null);
  const folderRef = useRef(null);
  const fileRef = useRef(null);

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
        const randomName = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        });

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

  const handleClick = async (docRef, folder = false) => {
    if (folder) {
      setFocus({ path: docRef.fullPath });
      return;
    }

    let content;

    const removedRootName = docRef.fullPath.substring(docRef.fullPath.indexOf("/") + 1);
    const removedProjectName = removedRootName.substring(removedRootName.indexOf("/") + 1);

    const fileExtension = docRef.name.split(".").pop();
    const language = getLanguage(fileExtension);

    let tab = null;
    if (Object.values(tabs).indexOf(true) > -1) tab = Object.keys(tabs).find((key) => tabs[key] === true);

    const newObject = { ...tabs };
    if (tab !== null) {
      saveFile(tab);
      newObject[tab] = false;
    }
    newObject[removedProjectName] = true;
    setTabs(newObject);

    setFocus({ path: docRef.fullPath });

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
    if (tab !== null && tab.localeCompare(name) != 0) {
      saveFile(tab);
      newObject[tab] = false;
    }
    newObject[name] = true;
    setTabs(newObject);

    monacoInstance.editor.setModelLanguage(monacoInstance.editor.getModels()[0], language);

    bindEditor(documentList.get(name));
  };

  const closeTab = (name) => {
    setFocus({ path: "projects/SyncSpace/" });
    saveFile(name);
    const newObject = { ...tabs };
    delete newObject[name];
    setTabs(newObject);
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const tabsContainer = tabsContainerRef?.current;
    tabsContainer.scrollLeft += e.deltaY;
  };

  const addNewFolder = (e) => {
    e.preventDefault();

    const folderName = folderRef.current.value;
    const initialLength = focus.path.length;

    const checkForFile = focus.path.split(".").pop();
    const newPath =
      checkForFile.length < initialLength
        ? `${focus.path.substring(0, focus.path.lastIndexOf("/") + 1)}/${folderName}/‎`
        : `${focus.path}/${folderName}/‎`;

    const storageRef = ref(storage, newPath);

    uploadString(storageRef, "").then(() => {
      setNewFolderModal(false);
      updateState(newPath);
      handleClick(storageRef, true);
    });
  };

  const addNewFile = (e) => {
    e.preventDefault();

    const fileName = fileRef.current.value;
    const initialLength = focus.path.length;

    const checkForFile = focus.path.split(".").pop();
    const newPath =
      checkForFile.length < initialLength
        ? `${focus.path.substring(0, focus.path.lastIndexOf("/") + 1)}/${fileName}`
        : `${focus.path}/${fileName}`;

    const storageRef = ref(storage, newPath);

    uploadString(storageRef, "\n")
      .then(() => {
        setNewFileModal(false);
        updateState(newPath);
        handleClick(storageRef);
      })
      .catch((error) => alert(error));
  };

  const documentClick = useCallback(() => {
    rightClick && setRightClick(false);
  }, [rightClick]);

  const rightClickHandle = (e, path, folder = false) => {
    e.preventDefault();
    setRightClick(false);
    const coord = {
      x: e.pageX,
      y: e.pageY,
    };
    setXY(coord);
    setRightClick(true);
    setDeletedPath({ path: path, folder: folder });
  };

  const deleteFolder = (path) => {
    const storageRef = ref(storage, path);
    listAll(storageRef)
      .then((dir) => {
        dir.items.forEach((fileRef) => deleteFile(fileRef.fullPath));
        dir.prefixes.forEach((folderRef) => deleteFolder(folderRef.fullPath));
      })
      .catch((error) => console.log(error));
  };

  const deleteFile = (pathToFile) => {
    const storageRef = ref(storage, pathToFile);
    const removedRootName = pathToFile.substring(pathToFile.indexOf("/") + 1);
    const removedProjectName = removedRootName.substring(removedRootName.indexOf("/") + 1);

    closeTab(removedProjectName);

    deleteObject(storageRef)
      .then(() => {
        setDeletedPath({ path: "", folder: false });
        updateState(pathToFile);
        setRightClick(false);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (deletedPath.folder) deleteFolder(deletedPath.path);
    else deleteFile(deletedPath.path);
  };

  const saveFile = (name, value = null) => {
    const storageRef = ref(storage, `/projects/SyncSpace/${name}`);
    let data;

    if (value === null) {
      const content = documentList.get(name).toString();

      const encoder = new TextEncoder();
      data = encoder.encode(content);
    } else data = value;

    uploadBytes(storageRef, data)
      .then()
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    document.addEventListener("click", documentClick);
    return () => document.removeEventListener("click", documentClick);
  });

  useEffect(() => {
    const save = setInterval(() => {
      let tab = null;
      if (Object.values(tabs).indexOf(true) > -1) tab = Object.keys(tabs).find((key) => tabs[key] === true);

      if (tab !== null) saveFile(tab);
    }, 60 * 1000);

    return () => clearInterval(save);
  }, [tabs]);

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
            <div className={styles.actionButtons}>
              <button type="button" className={styles.button} onClick={() => setNewFileModal(true)}>
                <BsFilePlus />
                New file
              </button>
              <Modal open={newFileModal} onClose={() => setNewFileModal(false)}>
                <h2>File name</h2>
                <form onSubmit={addNewFile}>
                  <input
                    type="text"
                    ref={fileRef}
                    className={styles.modalInput}
                    required={true}
                    placeholder="Give a name for the file"
                  />
                  <button type="submit" className={styles.modalButton}>
                    Create new file
                  </button>
                </form>
              </Modal>
              <button type="button" className={styles.button} onClick={() => setNewFolderModal(true)}>
                <BsFolderPlus />
                New folder
              </button>
              <Modal open={newFolderModal} onClose={() => setNewFolderModal(false)}>
                <h2>Folder name</h2>
                <form onSubmit={addNewFolder}>
                  <input
                    type="text"
                    ref={folderRef}
                    className={styles.modalInput}
                    required={true}
                    placeholder="Give a name for the folder"
                  />
                  <button type="submit" className={styles.modalButton}>
                    Create new file
                  </button>
                </form>
              </Modal>
            </div>
            <FileExplorer
              docRef={projectRef}
              onClick={handleClick}
              focusedItem={focus.path}
              key={newUpdate}
              rightClick={rightClickHandle}
            />
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
          <div
            style={{
              display: (monacoBinding === null || Object.values(tabs).indexOf(true) < 0) && "none",
            }}
          >
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
      {rightClick && (
        <div className={styles.rightClick} style={{ top: xy.y, left: xy.x }}>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EditorComponent;
