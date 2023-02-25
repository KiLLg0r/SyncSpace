"use client";

// Nagivation
import { useRouter } from "next/navigation";
import Link from "next/link";

// Monaco Editor import
import Editor from "@monaco-editor/react";

// Styles
import styles from "./Project.module.scss";
import modal from "@components/Modal/Modal.module.scss";

// Firebase
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@config/firebase";
import { ref, list, uploadBytes, getBytes } from "firebase/storage";

// Auth store
import authStore from "@store/authStore";

// React
import { useState, useRef, useEffect } from "react";

// Components
import FileExplorer from "@components/File explorer";
import Modal from "@components/Modal";

// Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// SVG
import Empty from "@public/empty.svg";

// Utils
import { getLanguage } from "@utils/languages";

const Project = ({ params }) => {
  const currentUser = authStore((state) => state.currentUser);
  const router = useRouter();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [projectData, setProjectData] = useState(0);
  const [hasFiles, setHasFiles] = useState(false);
  const [supportFileSystemAccessAPI, setSupportFileSystemAccessAPI] = useState(null);
  const [focus, setFocus] = useState({ path: `users/${params.username}/${params.projectname}/` });
  const [showEditor, setShowEditor] = useState(false);
  const [editorRef, setEditorRef] = useState(null);
  const [monacoRef, setMonacoRef] = useState(null);

  const inputRef = useRef(null);

  const ignoreFilesAndFolders = [
    "/node_modules",
    "/.next",
    "/.git",
    "/out",
    "/build",
    "/coverage",
    ".env",
    ".vscode",
    ".pnp",
    ".vercel",
    ".DS_Store",
  ];

  const handleEditorDidMount = (editor, monaco) => {
    setMonacoRef(monaco);
    setEditorRef(editor);
  };

  useEffect(() => {
    const getProjectData = async (path) => {
      const { username, projectname } = path;
      const docRef = doc(db, "users", username, "projects", projectname);
      const docSnap = await getDoc(docRef);

      return docSnap.data() || null;
    };

    const projectHasFiles = async (path) => {
      const { username, projectname } = path;
      const projectRef = ref(storage, `users/${username}/${projectname}`);
      const res = await list(projectRef, { maxResults: 1 });
      return res.items.length > 0 || res.prefixes.length > 0;
    };

    if (!hasFiles) projectHasFiles(params).then((res) => setHasFiles(res));
    if (!projectData) getProjectData(params).then((res) => setProjectData(res));
  }, [params, projectData, hasFiles]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("showDirectoryPicker" in window) setSupportFileSystemAccessAPI(true);
      else setSupportFileSystemAccessAPI(false);
    }
  }, []);

  const getFiles = async (directoryHandle, path = "") => {
    for await (const entry of directoryHandle.values()) {
      if (
        !ignoreFilesAndFolders.some((ignore) => path.includes(ignore)) ||
        !ignoreFilesAndFolders.some((ignore) => entry.name.includes(ignore))
      )
        if (entry.kind === "directory") await getFiles(entry, `${path}/${entry.name}`);
        else {
          const fileObj = await entry.getFile();
          const initialPath = `${path}/${entry.name}`;
          const fullPath = initialPath.substring(initialPath.indexOf("/") + 1);
          setFiles((files) => [...files, { file: fileObj, path: fullPath }]);
        }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  // Using webkitGetAsEntry for browser which do not supports File System Access API
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setFiles([]);
    setDragActive(false);

    const fileHandlesPromises = [...e.dataTransfer.items].map((item) => item.webkitGetAsEntry());

    const getFiles = async (handle) => {
      if (!ignoreFilesAndFolders.some((ignore) => handle.fullPath.includes(ignore)))
        if (handle.isDirectory) {
          const dirReader = handle.createReader();
          const entries = await new Promise((resolve) => dirReader.readEntries(resolve));
          return Promise.all(entries.map((entry) => getFiles(entry)));
        } else {
          const file = await handle.file((file) => file);
          const newPath = handle.fullPath.substring(handle.fullPath.indexOf("/") + 1);
          setFiles((files) => [...files, { file: file, path: newPath.substring(newPath.indexOf("/") + 1) }]);
        }
    };
    const promise = new Promise((resolve) => {
      for (const handle of fileHandlesPromises) getFiles(handle);
      setConfirmUpload(true);
      resolve();
    });

    toast.promise(promise, {
      pending: "The folder is loading",
      success: "Folder loaded successfully 👌",
      error: "The folder could not be loaded 🤯",
    });
  };

  // Using getAsFileSystemHandle() for browser which supports File System Access API
  const handleDropFileSystemAPI = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setFiles([]);
    setDragActive(false);

    const fileHandlesPromises = [...e.dataTransfer.items].map((item) => item.getAsFileSystemHandle());
    const promise = new Promise((resolve) => {
      getFiles(fileHandlesPromises);
      setConfirmUpload(true);
      resolve();
    });

    toast.promise(promise, {
      pending: "The folder is loading",
      success: "Folder loaded successfully 👌",
      error: "The folder could not be loaded 🤯",
    });
  };

  const handleChange = function (e) {
    if (e.target.files && e.target.files[0]) {
      const targetFiles = e.target.files;
      filterFiles(targetFiles);
      setConfirmUpload(true);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const onDirectoryButtonClick = async () => {
    setFiles([]);

    try {
      const directoryHandle = await window.showDirectoryPicker();

      const promise = new Promise((resolve) => {
        getFiles(directoryHandle);
        setConfirmUpload(true);
        resolve();
      });

      toast.promise(promise, {
        pending: "The folder is loading",
        success: "Folder loaded successfully 👌",
        error: "The folder could not be loaded 🤯",
      });
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  };

  const filterFiles = (files) => {
    setFiles([]);
    const fileList = [];

    for (const file of files) {
      const relativePath = file.webkitRelativePath;
      if (!ignoreFilesAndFolders.some((ignore) => relativePath.includes(ignore)))
        fileList.push({ file: file, path: relativePath.substring(relativePath.indexOf("/") + 1) });
    }
    setFiles(fileList);
  };

  const uploadFiles = async () => {
    const { username, projectname } = params;
    const projectRef = ref(storage, `users/${username}/${projectname}/`);

    const promise = new Promise((resolve) => {
      for (const file of files) {
        const fileRef = ref(projectRef, file.path);
        uploadBytes(fileRef, file.file);
      }
      setConfirmUpload(false);
      resolve();
    });

    toast.promise(promise, {
      pending: "The folder is being uploaded",
      success: "Folder uploaded successfully 👌",
      error: "The folder could not be uploaded 🤯",
    });
  };

  const fileClick = async (docRef, folder = false) => {
    if (folder) {
      setFocus({ path: docRef.fullPath });
      return;
    }

    const fileExtension = docRef.name.split(".").pop();
    const fileLanguage = getLanguage(fileExtension);

    setFocus({ path: docRef.fullPath });

    await getBytes(docRef)
      .then((res) => {
        const decoder = new TextDecoder();
        setLanguage(fileLanguage);
        setCode(decoder.decode(res));
        setShowEditor(true);
      })
      .catch((error) => alert(error));
  };

  if (
    projectData === null ||
    (projectData?.visibility === "private" && projectData?.owner !== currentUser?.displayName)
  )
    router.push("/404");

  return (
    <div className={styles.container}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className={styles.header}>{projectData?.name}</div>
      <main className={styles.content}>
        <div className={styles.code}>
          {hasFiles ? (
            <FileExplorer
              docRef={ref(storage, `users/${params.username}/${params.projectname}`)}
              onClick={fileClick}
              focusedItem={focus.path}
              rightClick={() => {}}
            />
          ) : (
            <div className={styles.noFiles}>
              <Empty />
              <p>Currently this project does not contain any files or folders.</p>
            </div>
          )}
          {!hasFiles && projectData?.owner === currentUser?.displayName && (
            <form className={styles.filesUpload} onDragEnter={handleDrag}>
              <input
                ref={inputRef}
                type="file"
                className={styles["input-file-upload"]}
                webkitdirectory="true"
                directory="true"
                multiple
                onChange={!supportFileSystemAccessAPI ? handleChange : null}
              />
              <label
                htmlFor="input-file-upload"
                className={`${dragActive && styles["drag-active"]} ${styles["label-file-upload"]}`}
              >
                <div>
                  <p>You don&apos;t have any files or folders in your project.</p>
                  <p>
                    You can add a folder via <span style={{ color: "var(--green)" }}>Edit project</span> button,{" "}
                    <span style={{ color: "var(--accent)" }}>Upload a folder </span>
                    button or drag and drop.
                  </p>
                  <button
                    type="button"
                    className={styles["upload-button"]}
                    onClick={!supportFileSystemAccessAPI ? onButtonClick : onDirectoryButtonClick}
                  >
                    Upload a folder
                  </button>
                  <p style={{ fontWeight: 400, fontSize: "0.85rem", color: "var(--gray-light-400)", padding: "1rem" }}>
                    If you decide to upload the folder through the Upload Folder button, you must consider that only the
                    content of the folder (subfolders, files) will be loaded, not the respective folder.
                    <br />
                    If you want to load both the folder and its contents, we suggest you drag and drop the folder here.
                  </p>
                </div>
              </label>
              {dragActive && (
                <div
                  className={styles["drag-file-element"]}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={!supportFileSystemAccessAPI ? handleDrop : handleDropFileSystemAPI}
                ></div>
              )}
            </form>
          )}
          <div style={{ display: !showEditor && "none" }}>
            <Editor
              height="100vh"
              width="100%"
              theme="vs-dark"
              value={code}
              language={language}
              onChange={setCode}
              onMount={handleEditorDidMount}
              options={{ readOnly: true }}
              className={styles.editor}
            />
          </div>
        </div>
        <div className={styles.line}></div>
        <aside className={styles.aside}>
          {currentUser?.displayName === projectData?.owner && (
            <Link href={`/${params.username}/${params.projectname}/edit`} className={styles.editBtn}>
              Edit project
            </Link>
          )}
          <div className={styles.item}>
            <div className={styles.label}>Owner</div>
            <div className={styles.value}>{projectData?.owner}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>Description</div>
            <div className={styles.value}>{projectData?.description}</div>
          </div>
        </aside>
      </main>
      <Modal
        open={confirmUpload}
        onClose={() => {
          setConfirmUpload(false);
        }}
      >
        <h2>Confirm upload</h2>
        <p className={styles.modalSubtitle}>Are you sure you want to upload these files?</p>
        {files &&
          files.map((file, index) => {
            return (
              <p key={index} className={styles.fileName}>
                {file.path}
              </p>
            );
          })}
        <button type="button" onClick={uploadFiles} className={modal.modalButton}>
          Upload
        </button>
      </Modal>
    </div>
  );
};

export default Project;
