"use client";

// Styles
import styles from "./Upload.module.scss";
import modal from "@components/Modal/Modal.module.scss";

// Firebase
import { storage } from "@config/firebase";
import { ref, uploadBytes } from "firebase/storage";

// Auth store
import useAuthStore from "@store/useAuthStore";

// React
import { useState, useRef, useEffect } from "react";

// Components
import Modal from "@components/Modal";

// Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Upload = ({ params }) => {
  const projects = useAuthStore((state) => state.projects);
  const project = projects.find((o) => o.name === params.projectName);

  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [supportFileSystemAccessAPI, setSupportFileSystemAccessAPI] = useState(false);
  const [warning, setWarning] = useState(true);

  const inputRef = useRef(null);

  const ignoreFilesAndFolders = [
    "node_modules",
    ".next",
    ".git",
    "out",
    "build",
    "coverage",
    ".env",
    ".vscode",
    ".pnp",
    ".vercel",
    ".DS_Store",
  ];

  useEffect(() => {
    if (typeof window !== "undefined")
      if ("showDirectoryPicker" in window) {
        setSupportFileSystemAccessAPI(true);
        setWarning(false);
      } else {
        setSupportFileSystemAccessAPI(false);
        setWarning(true);
      }
  }, []);

  const getFiles = async (directoryHandle, path = "") => {
    for await (const entry of directoryHandle.values()) {
      if (
        !ignoreFilesAndFolders.some((ignore) => path.includes(ignore)) &&
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
    const { projectName } = params;
    const username = project.owner;
    const projectRef = ref(storage, `users/${username}/${projectName}/`);

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

  return (
    <>
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

        <main className={styles.content}>
          <div className={styles.code}>
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
                  <p>⚠️ Be careful! ⚠️</p>
                  <p>If you already have files in the project, loading others can lead to overwriting the old ones.</p>
                  <p style={{ fontWeight: 400, fontSize: "0.85rem", color: "var(--gray-light-400)", padding: "1rem" }}>
                    If you decide to upload the folder through the Upload Folder button, you must consider that only the
                    content of the folder (subfolders, files) will be loaded, not the respective folder.
                    <br />
                    If you want to load both the folder and its contents, we suggest you drag and drop the folder here.
                  </p>
                  <button
                    type="button"
                    className={styles["upload-button"]}
                    onClick={!supportFileSystemAccessAPI ? onButtonClick : onDirectoryButtonClick}
                  >
                    Upload a folder
                  </button>
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
          </div>
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
        <Modal
          open={warning}
          onClose={() => {
            setWarning(false);
          }}
        >
          <h2>⚠️ Warning ⚠️</h2>
          <p className={styles.modalSubtitle}>
            Your browser does not support File System Access API, so loading folders and files will be slower and will
            not display states like loading, only finished if is successfull.
          </p>
          <button type="button" onClick={() => setWarning(false)} className={modal.modalButton}>
            Close
          </button>
        </Modal>
      </div>
    </>
  );
};

export default Upload;
