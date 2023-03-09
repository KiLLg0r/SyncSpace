"use client";
// Next / Reacts imports
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Monaco Editor import
import Editor from "@monaco-editor/react";

// Yjs imports
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { MonacoBinding } from "@lib/y-monaco";

// Other imports
import randomColor from "randomcolor";

// Styles
import styles from "./Editor.module.scss";
// Icons
import { BsFolderFill, BsBoxArrowLeft, BsFolderPlus, BsFilePlus } from "react-icons/bs";

// Components
import Tab from "@components/Tab";
import Loading from "@components/Loading";
import TreeNode from "@components/TreeNode";

// Firebase
import { ref, getBytes, uploadBytes } from "firebase/storage";
import { storage } from "@config/firebase";

// Utils
import { getLanguage } from "@utils/languages";
import theme from "@utils/theme-dark.json";

// Auth store
import authStore from "@store/authStore";

// Hooks
import useTree from "@hooks/useTree";

let ydocument = new Y.Doc();
let documentList = ydocument.getMap("project-files");
let monacoEditor = null;
let monacoInstance = null;
let provider = null;
let awareness = null;
let monacoBinding = null;

const EditorComponent = ({ params }) => {
  const [code, setCode] = useState("");
  const [editorRef, setEditorRef] = useState(null);
  const [tabs, setTabs] = useState({});
  const [rightClick, setRightClick] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [rightClickData, setRightClickData] = useState({ path: "", folder: false, id: 0 });
  const [renamedNode, setRenamedNode] = useState(-1);
  const [explorerData, setExplorerData] = useState({});
  const [focus, setFocus] = useState({
    path: `users/${params.username}/${params.projectname}/`,
    isFolder: true,
    input: {
      visible: false,
      isFolder: false,
    },
  });

  const currentUser = authStore((state) => state.currentUser);
  const tabsContainerRef = useRef(null);
  const router = useRouter();

  const { insertNode, createFileTree, orderTree, deleteNode, renameNode } = useTree();

  const handleEditorDidMount = (editor, monaco) => {
    monacoEditor = editor;
    monacoInstance = monaco;

    monaco.editor.defineTheme("syncspace", theme);
    monaco.editor.setTheme("syncspace");

    setEditorRef(editor);
  };

  const handleInsertNode = (folderId, item, isFolder, path) => {
    const finalTree = insertNode(explorerData, folderId, item, isFolder, path);
    const orderedTree = orderTree(finalTree);

    setFocus({ ...focus, path: `${path}/${item}/`, isFolder: isFolder, input: { visible: false, isFolder: false } });
    setExplorerData(orderedTree);
  };

  const handleDeleteNode = (e) => {
    e.preventDefault();

    const tree = deleteNode(explorerData, rightClickData.id);

    const removedStorageName = rightClickData.path.substring(rightClickData.path.indexOf("/") + 1);
    const removedUsername = removedStorageName.substring(removedStorageName.indexOf("/") + 1);
    const removedProjectName = removedUsername.substring(removedUsername.indexOf("/") + 1);

    let tab = !(removedProjectName in tabs);
    if (!tab) closeTab(removedProjectName);

    setRightClick(false);
    setExplorerData(tree);
  };

  const handleRenameClick = (e) => {
    e.preventDefault();
    setRightClick(false);
    setRenamedNode(rightClickData.id);
  };

  const handleRenameNode = async (id, newName) => {
    const tree = renameNode(explorerData, id, newName, documentList);
    const orderedTree = orderTree(tree);

    setRenamedNode(-1);
    setExplorerData(orderedTree);
  };

  const handleNew = (e, isFolder) => {
    e.preventDefault();
    e.stopPropagation();
    setFocus({
      ...focus,
      input: {
        visible: true,
        isFolder,
      },
    });
  };

  if (!currentUser || params.username !== currentUser?.displayName)
    router.replace(`/${params.username}/${params.projectname}/`);

  const bindEditor = (ytext) => {
    if (monacoBinding) monacoBinding.destroy();
    const yUndoManager = new Y.UndoManager(ytext);
    monacoBinding = new MonacoBinding(ytext, monacoEditor.getModel(), new Set([monacoEditor]), awareness, {
      yUndoManager,
    });
  };

  const handleClick = async (path, folder = false) => {
    if (folder) {
      setFocus({ ...focus, path: path });
      return;
    }

    let content;

    const removedStorageName = path.substring(path.indexOf("/") + 1);
    const removedUsername = removedStorageName.substring(removedStorageName.indexOf("/") + 1);
    const removedProjectName = removedUsername.substring(removedUsername.indexOf("/") + 1);

    const fileExtension = path.split(".").pop();
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

    setFocus({ ...focus, path: path });

    monacoInstance.editor.setModelLanguage(monacoInstance.editor.getModels()[0], language);

    if (documentList.has(removedProjectName)) {
      bindEditor(documentList.get(removedProjectName));
    } else {
      await getBytes(ref(storage, path))
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
    setFocus({ ...focus, path: `users/${params.username}/${params.projectname}/` });
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

  const documentClick = useCallback(() => {
    rightClick && setRightClick(false);
    renamedNode !== -1 && setRenamedNode(-1);
  }, [renamedNode, rightClick]);

  const rightClickHandle = (e, path, type, id) => {
    e.preventDefault();
    setRightClick(false);
    const coord = {
      x: e.pageX,
      y: e.pageY,
    };
    setCoords(coord);
    setRightClick(true);
    setRightClickData({ path: path, isFolder: type ? "folder" : "file", id: id });
  };

  const saveFile = (name, value = null) => {
    const storageRef = ref(storage, `users/${params.username}/${params.projectname}/${name}`);
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
    if (Object.keys(explorerData).length === 0) {
      const data = createFileTree(
        ref(storage, `users/${params.username}/${params.projectname}/`),
        `users/${params.username}/${params.projectname}/`,
        params.projectname,
      );
      setExplorerData(data);
    }
  }, [createFileTree, explorerData, params]);

  useEffect(() => {
    if (editorRef) {
      try {
        provider = new WebrtcProvider("monaco", ydocument, {
          // signaling: ["wss://syncspace-websocket.herokuapp.com/"],
        });
        awareness = provider.awareness;

        const randomcolor = randomColor();

        awareness.setLocalStateField("user", {
          name: currentUser.displayName,
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
  }, [currentUser, editorRef]);

  useEffect(() => {
    const save = setInterval(() => {
      let tab = null;
      if (Object.values(tabs).indexOf(true) > -1) tab = Object.keys(tabs).find((key) => tabs[key] === true);

      if (tab !== null) saveFile(tab);
    }, 60 * 1000);

    return () => clearInterval(save);
  }, [tabs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.addEventListener("click", documentClick);
    return () => document.removeEventListener("click", documentClick);
  });

  return (
    <div className={styles.editor}>
      {editorRef === null && <Loading />}
      <header className={styles.header}>
        <div className={styles.leftSide}>
          <BsFolderFill className={styles.icon} />
          {params.projectname}
        </div>
        <div className={styles.rightSide}>
          <Link href={`/${params.username}/${params.projectname}`}>
            Exit editing <BsBoxArrowLeft />
          </Link>
        </div>
      </header>
      <main>
        <aside
          className={styles.files}
          onClick={(e) => {
            e.preventDefault();
            documentClick();
            if (e.target === e.currentTarget)
              setFocus({ ...focus, path: `users/${params.username}/${params.projectname}/` });
          }}
        >
          <div className={styles.actionButtons}>
            <button type="button" className={styles.button} onClick={(e) => handleNew(e, false)}>
              <BsFilePlus />
              New file
            </button>
            <button type="button" className={styles.button} onClick={(e) => handleNew(e, true)}>
              <BsFolderPlus />
              New folder
            </button>
          </div>
          <TreeNode
            tree={explorerData}
            explorer={explorerData}
            focusedItem={focus}
            renamedNode={renamedNode}
            handleInsertNode={handleInsertNode}
            handleClick={handleClick}
            setFocusedItem={setFocus}
            rightClick={rightClickHandle}
            setRenamedNode={setRenamedNode}
            handleRenameNode={handleRenameNode}
          />
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
            />
          </div>
        </section>
      </main>
      {rightClick && (
        <div className={styles.rightClick} style={{ top: coords.y, left: coords.x }}>
          <button type="button" onClick={handleDeleteNode}>
            Delete
          </button>
          <button type="button" onClick={handleRenameClick}>
            Rename
          </button>
        </div>
      )}
    </div>
  );
};

export default EditorComponent;
