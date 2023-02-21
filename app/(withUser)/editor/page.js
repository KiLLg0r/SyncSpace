"use client";
// Next / Reacts imports
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

// Monaco Editor import
import Editor from "@monaco-editor/react";

// Yjs imports
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { MonacoBinding } from "../../../lib/y-monaco";

// Other imports
import randomColor from "randomcolor";
const { uniqueNamesGenerator, adjectives, colors, animals, languages } = require("unique-names-generator");

// Styles
import styles from "./Editor.module.scss";
import modalStyles from "@components/Modal/Modal.module.scss";
import errorStyles from "@styles/Error.module.css";

// Icons
import { BsFolderFill, BsBoxArrowLeft, BsFiles, BsFolderPlus, BsFilePlus } from "react-icons/bs";

// Components
import FileExplorer from "@components/File explorer";
import Tab from "@components/Tab";
import Loading from "@components/Loading";
import Modal from "@components/Modal";

// Firebase
import { ref, getBytes, uploadString, deleteObject, listAll, uploadBytes } from "firebase/storage";
import { storage } from "@config/firebase";

// Utils
import { getLanguage } from "@utils/languages";

// React hooks form
import { useForm } from "react-hook-form";

// Animation
import { motion, AnimatePresence } from "framer-motion";

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
  const [renameModal, setRenameModal] = useState(false);
  const [rightClick, setRightClick] = useState(false);
  const [xy, setXY] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState({ path: "", folder: false });

  const {
    register: registerFile,
    handleSubmit: handleSubmitFile,
    formState: { errors: errorsFile },
  } = useForm();

  const {
    register: registerFolder,
    handleSubmit: handleSubmitFolder,
    formState: { errors: errorsFolder },
  } = useForm();

  const {
    register: registerRename,
    handleSubmit: handleSubmitRename,
    formState: { errors: errorsRename },
  } = useForm();

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

  const addNewFolder = (data, e) => {
    e.preventDefault();

    const folderName = data.folder;
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

  const addNewFile = (data, e) => {
    e.preventDefault();

    const fileName = data.file;
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
    setPath({ path: path, folder: folder });
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

    let tab = !(removedProjectName in tabs);
    if (!tab) closeTab(removedProjectName);

    deleteObject(storageRef)
      .then(() => {
        setPath({ path: "", folder: false });
        updateState(pathToFile);
        setRightClick(false);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (path.folder) deleteFolder(path.path);
    else deleteFile(path.path);
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

  const renameFolder = (pathToFolder, newPath, oldPath) => {
    const storageRef = ref(storage, pathToFolder);
    listAll(storageRef)
      .then((dir) => {
        dir.items.forEach((fileRef) => {
          renameFile(fileRef.fullPath, newPath, oldPath);
        });
        dir.prefixes.forEach((folderRef) => renameFolder(folderRef.fullPath, newPath, oldPath));
      })
      .catch((error) => console.log(error));
    deleteFolder(pathToFolder);
  };

  const renameFile = async (pathToFile, newPath, oldPath) => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const removedRootName = pathToFile.substring(pathToFile.indexOf("/") + 1);
    const removedProjectName = removedRootName.substring(removedRootName.indexOf("/") + 1);

    const path = pathToFile.replace(oldPath, newPath);

    const storageRef = ref(storage, pathToFile);
    const newStorageRef = ref(storage, path);
    let content;

    if (documentList.has(removedProjectName)) content = documentList.get(removedProjectName).toString();
    else
      await getBytes(storageRef)
        .then((res) => {
          content = decoder.decode(res);
        })
        .catch((error) => alert(error));

    const saveContent = encoder.encode(content);

    uploadBytes(newStorageRef, saveContent)
      .then(() => {
        setPath({ path: "", folder: false });
        updateState(pathToFile);
        setRightClick(false);
      })
      .catch((error) => alert(error));

    deleteFile(pathToFile);
  };

  const handleRename = (data, e) => {
    e.preventDefault();
    const oldPath = path.path;
    const currentPath = oldPath.split("/");
    currentPath.pop();
    currentPath.push(data.rename);

    const newPath = currentPath.join("/");
    if (path.folder) renameFolder(oldPath, newPath, oldPath);
    else renameFile(oldPath, newPath, oldPath);

    setRenameModal(false);
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

  console.log(errorsFile, errorsFolder, errorsRename);

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
              <button type="button" className={styles.button} onClick={() => setNewFolderModal(true)}>
                <BsFolderPlus />
                New folder
              </button>
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
          <button type="button" onClick={() => setRenameModal(true)}>
            Rename
          </button>
        </div>
      )}
      <Modal open={newFileModal} onClose={() => setNewFileModal(false)}>
        <h2>File name</h2>
        <form onSubmit={handleSubmitFile(addNewFile)}>
          <input
            type="text"
            className={modalStyles.modalInput}
            placeholder="Give a name for this file"
            autoFocus={true}
            aria-invalid={errorsFile.file ? "true" : "false"}
            {...registerFile("file", { required: true, pattern: /^[\w,\s-]+\.[A-Za-z]{2,4}$/i })}
          />
          <AnimatePresence>
            {errorsFile.file?.type === "required" && (
              <motion.p
                role="alert"
                className={errorStyles.error}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                The file name is required
              </motion.p>
            )}
            {errorsFile.file?.type === "pattern" && (
              <motion.p
                role="alert"
                className={errorStyles.error}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                The given name is not a file
              </motion.p>
            )}
          </AnimatePresence>
          <button type="submit" className={modalStyles.modalButton}>
            Create new file
          </button>
        </form>
      </Modal>
      <Modal open={newFolderModal} onClose={() => setNewFolderModal(false)}>
        <h2>Folder name</h2>
        <form onSubmit={handleSubmitFolder(addNewFolder)}>
          <input
            type="text"
            className={modalStyles.modalInput}
            autoFocus={true}
            placeholder="Give a name for this folder"
            aria-invalid={errorsFolder.folder ? "true" : "false"}
            {...registerFolder("folder", { required: true })}
          />
          <AnimatePresence>
            {errorsFolder.folder?.type === "required" && (
              <motion.p
                role="alert"
                className={errorStyles.error}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                The folder name is required
              </motion.p>
            )}
          </AnimatePresence>
          <button type="submit" className={modalStyles.modalButton}>
            Create new folder
          </button>
        </form>
      </Modal>
      <Modal
        open={renameModal}
        onClose={() => {
          setRenameModal(false);
          setRightClick(false);
        }}
      >
        <h2>Rename</h2>
        <form onSubmit={handleSubmitRename(handleRename)}>
          <input
            defaultValue={path.path.split("/").pop()}
            type="text"
            className={modalStyles.modalInput}
            autoFocus={true}
            placeholder="Give a new name"
            aria-invalid={errorsRename.rename ? "true" : "false"}
            {...registerRename("rename", { required: true })}
          />
          <AnimatePresence>
            {errorsRename.rename?.type === "required" && (
              <motion.p
                role="alert"
                className={errorStyles.error}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                A new name is required
              </motion.p>
            )}
            {errorsRename.rename?.type === "custom" && (
              <motion.p
                role="alert"
                className={errorStyles.error}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                {errorsRename.rename?.message}
              </motion.p>
            )}
          </AnimatePresence>
          <button type="submit" className={modalStyles.modalButton}>
            Rename
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EditorComponent;
