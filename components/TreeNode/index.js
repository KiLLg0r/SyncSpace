"use client";

// React
import { useEffect, useState, useRef } from "react";

// Styles
import styles from "./Tree.module.scss";
import errorStyles from "@styles/Error.module.css";

// Icons
import { BsFillFileEarmarkFill, BsFolderFill, BsChevronUp } from "react-icons/bs";

// Framer motion
import { motion, AnimatePresence } from "framer-motion";

// Utils
import useTree from "@hooks/useTree";

function TreeNode({
  tree,
  explorer,
  focusedItem,
  renamedNode,
  handleInsertNode = () => {},
  setFocusedItem = () => {},
  handleClick = () => {},
  rightClick = () => {},
  setRenamedNode = () => {},
  handleRenameNode = () => {},
}) {
  const { id, type, name, fullPath } = explorer;
  const {
    path,
    input: { visible },
  } = focusedItem;

  const [show, setShow] = useState(path === fullPath);
  const [errors, setErrors] = useState({
    rename: false,
    insertFile: false,
    insertFolder: false,
  });

  const fileRef = useRef(null);
  const folderRef = useRef(null);

  const { checkForExistingNameInCurrentNode, checkForExistingName } = useTree();

  const toggleShow = () => {
    setShow(!show);
  };

  const onAddFolder = (e) => {
    if (e.keyCode === 13 && e.target.value && !(errors.insertFile && errors.insertFolder))
      handleInsertNode(id, e.target.value, focusedItem.input.isFolder, fullPath);
    else if (e.keyCode === 27)
      setFocusedItem({
        ...focusedItem,
        input: {
          visible: false,
          isFolder: false,
        },
      });
  };

  const onRename = (e) => {
    if (e.keyCode === 27) setRenamedNode(-1);
    else if (e.keyCode === 13 && e.target.value && !errors.rename) handleRenameNode(id, e.target.value);
  };

  useEffect(() => {
    if (visible && fullPath === path) setShow(true);
  }, [fullPath, path, visible]);

  useEffect(() => {
    if (renamedNode === id)
      if (type === "file") fileRef.current.focus();
      else folderRef.current.focus();
  }, [renamedNode, type, id]);

  if (type === "folder")
    return (
      <div className={`${path === fullPath && styles.focused}`}>
        <div
          onClick={() => {
            toggleShow();
            handleClick(fullPath, true);
          }}
          onContextMenu={(e) => (id === 0 ? {} : rightClick(e, fullPath, type, id))}
          className={styles.folder}
        >
          <BsChevronUp style={{ transform: show && "rotate(180deg)" }} />
          <BsFolderFill fill="#ffd04b" />

          <input
            type="text"
            ref={folderRef}
            defaultValue={name}
            onKeyDown={onRename}
            disabled={renamedNode !== id}
            aria-invalid={errors.rename}
            onBlur={(e) => {
              e.target.value = name;
              setErrors({ ...errors, rename: false });
            }}
            onChange={(e) => {
              if (checkForExistingName(tree, e.target.value)) setErrors({ ...errors, rename: true });
              else setErrors({ ...errors, rename: false });
            }}
          />
        </div>
        <AnimatePresence
          key={"renameFolderError"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {errors.rename && <motion.div className={errorStyles.errorSmall}>This name already exists</motion.div>}
        </AnimatePresence>

        <div style={{ display: show ? "block" : "none", paddingLeft: "1rem" }}>
          {focusedItem.input.visible && focusedItem.input.isFolder && path === fullPath && (
            <>
              <div className={styles.inputContainer}>
                <BsChevronUp />
                <span>
                  <BsFolderFill fill="#ffd04b" />
                </span>
                <input
                  type="text"
                  className={styles.inputContainer__input}
                  autoFocus
                  onKeyDown={onAddFolder}
                  aria-invalid={errors.insertFolder}
                  onChange={(e) => {
                    if (checkForExistingNameInCurrentNode(explorer, e.target.value))
                      setErrors({ ...errors, insertFolder: true });
                    else setErrors({ ...errors, insertFolder: false });
                  }}
                  onBlur={() => {
                    setErrors({ ...errors, insertFolder: false });
                    setFocusedItem({
                      ...focusedItem,
                      input: {
                        visible: false,
                        isFolder: false,
                      },
                    });
                  }}
                />
              </div>
              <AnimatePresence
                key={"insertFolderError"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errors.insertFolder && (
                  <motion.div className={errorStyles.errorSmall}>This name already exists</motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {explorer.folders?.length > 0 &&
            explorer.folders.map((exp) => {
              return (
                <TreeNode
                  key={exp.id}
                  tree={tree}
                  explorer={exp}
                  focusedItem={focusedItem}
                  renamedNode={renamedNode}
                  handleInsertNode={handleInsertNode}
                  handleClick={handleClick}
                  setFocusedItem={setFocusedItem}
                  rightClick={rightClick}
                  setRenamedNode={setRenamedNode}
                  handleRenameNode={handleRenameNode}
                />
              );
            })}

          {focusedItem.input.visible && !focusedItem.input.isFolder && path === fullPath && (
            <>
              <div className={styles.inputContainer} style={{ paddingLeft: "1.5rem" }}>
                <span>
                  <BsFillFileEarmarkFill fill="#eaeaeb" />
                </span>
                <input
                  type="text"
                  className={styles.inputContainer__input}
                  autoFocus
                  onKeyDown={onAddFolder}
                  aria-invalid={errors.insertFile}
                  onChange={(e) => {
                    if (checkForExistingNameInCurrentNode(explorer, e.target.value))
                      setErrors({ ...errors, insertFile: true });
                    else setErrors({ ...errors, insertFile: false });
                  }}
                  onBlur={() => {
                    setErrors({ ...errors, insertFile: false });
                    setFocusedItem({
                      ...focusedItem,
                      input: {
                        visible: false,
                        isFolder: false,
                      },
                    });
                  }}
                />
              </div>
              <AnimatePresence
                key={"insertFileError"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errors.insertFile && (
                  <motion.div className={errorStyles.errorSmall}>This name already exists</motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {explorer.files?.length > 0 &&
            explorer.files.map((exp) => {
              return (
                <TreeNode
                  key={exp.id}
                  tree={tree}
                  explorer={exp}
                  focusedItem={focusedItem}
                  renamedNode={renamedNode}
                  handleInsertNode={handleInsertNode}
                  handleClick={handleClick}
                  setFocusedItem={setFocusedItem}
                  rightClick={rightClick}
                  setRenamedNode={setRenamedNode}
                  handleRenameNode={handleRenameNode}
                />
              );
            })}
        </div>
      </div>
    );

  if (name !== "‎")
    return (
      <>
        <div
          onClick={() => handleClick(fullPath)}
          onContextMenu={(e) => rightClick(e, fullPath, type, id)}
          className={`${styles.file} ${path === fullPath && styles.focused}`}
          key={id}
        >
          <span>
            <BsFillFileEarmarkFill fill="#eaeaeb" />
          </span>
          <input
            type="text"
            ref={fileRef}
            defaultValue={name}
            onKeyDown={onRename}
            disabled={renamedNode !== id}
            aria-invalid={errors.rename}
            onBlur={(e) => {
              e.target.value = name;
              setErrors({ ...errors, rename: false });
            }}
            onChange={(e) => {
              if (checkForExistingName(tree, e.target.value)) setErrors({ ...errors, rename: true });
              else setErrors({ ...errors, rename: false });
            }}
          />
        </div>
        <AnimatePresence
          key={"renameFileError"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {errors.rename && <motion.div className={errorStyles.errorSmall}>This name already exists</motion.div>}
        </AnimatePresence>
      </>
    );
}

export default TreeNode;
