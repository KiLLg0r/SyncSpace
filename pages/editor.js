// Next / Reacts imports
import React, { useState, useRef } from "react";

// Monaco Editor import
import Editor from "@monaco-editor/react";

// Yjs imports
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

// Other imports
import randomColor from "randomcolor";
const { uniqueNamesGenerator, adjectives, colors, animals } = require("unique-names-generator");

const Home = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("");

  const handleEditorDidMount = async (editor, monaco) => {
    editorRef.current = editor;

    const { MonacoBinding } = await import("y-monaco");

    const ydocument = new Y.Doc();
    const provider = new WebrtcProvider("monaco", ydocument);
    const type = ydocument.getText("monaco");

    const awareness = provider.awareness;
    console.log(awareness);

    const randomcolor = randomColor();
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

    console.log(awareness.getLocalState());
    console.log("");

    awareness.setLocalStateField("user", {
      name: randomName,
      color: randomcolor,
    });

    console.log("");
    console.log(awareness.getLocalState());

    const yUndoManager = new Y.UndoManager(type);

    const monacoBinding = new MonacoBinding(type, editor.getModel(), new Set([editor]), awareness, {
      yUndoManager,
    });
  };

  return (
    <div>
      <Editor
        height="99vh"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={setCode}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default Home;
