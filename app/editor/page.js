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
const { uniqueNamesGenerator, adjectives, colors, animals } = require("unique-names-generator");

// Styles
import styles from "./Editor.module.scss";

// Icons
import { BsFolderFill, BsBoxArrowLeft, BsFileCodeFill, BsFiles } from "react-icons/bs";

// Components
import File from "@components/File/file";

let ydocument = new Y.Doc();
let documentList = ydocument.getArray("doc-list");
let provider = null;
let awareness = null;
let monacoBinding = null;

const EditorComponent = () => {
  const [editorRef, setEditorRef] = useState(null);
  const [code, setCode] = useState("");
  const [docs, setDocs] = useState(documentList);

  const handleEditorDidMount = (editor, monaco) => {
    setEditorRef(editor);
  };

  const bindEditor = (ytext) => {
    if (monacoBinding) monacoBinding.destroy();
    const yUndoManager = new Y.UndoManager(ytext);
    monacoBinding = new MonacoBinding(ytext, editorRef.getModel(), new Set([editorRef]), awareness, {
      yUndoManager,
    });
  };

  const filesSelect = (event) => {
    const pressedButton = event.target;
    const val = pressedButton.getAttribute("index");
    if (editorRef && pressedButton.tagName !== "DIV")
      if (val === "new") {
        const newDoc = new Y.Text("");

        newDoc.applyDelta([{ insert: `const name = 'File #${documentList.length}';` }, { insert: "\n" }]);

        documentList.insert(documentList.length, [newDoc]);

        bindEditor(newDoc);
      } else if (val === "clear") {
        documentList.delete(0, documentList.length);
      } else {
        const index = Number.parseInt(val);
        bindEditor(documentList.get(index));
      }
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

  return (
    <div className={styles.editor}>
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
            <File name="app">
              <BsFolderFill />
            </File>
            {/*<File name="src">
              <BsFolderFill />
            </File>
            <File name="styles">
              <BsFolderFill />
            </File>
            <File name="lib">
              <BsFolderFill />
            </File>
            <File name="index.js">
              <BsFileCodeFill />
            </File>
            <File name="routes.js">
              <BsFileCodeFill />
            </File> */}
            <div onClick={filesSelect}>
              <input type="button" index="new" value="+ Create New Document" />
              <input type="button" index="clear" value="- Delete All" />
              {docs &&
                docs.toArray().map((ytext, i) => {
                  return <input type="button" index={i} value={`File ${i}`} key={i} />;
                })}
            </div>
          </div>
        </aside>
        <section>
          <nav className={styles.tabs}>
            <ul>
              <li className={styles.tab}>index.js</li>
              <li className={styles.tab}>routes.js</li>
            </ul>
          </nav>
          <div style={{ opacity: monacoBinding === null && "0" }}>
            <Editor
              height={"calc(100vh - 7rem)"}
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditorComponent;
