"use client";

// Monaco Editor import
import Editor from "@monaco-editor/react";

// Firebase
import { storage } from "@config/firebase";
import { ref, getBytes } from "firebase/storage";

// Components
import TreeNode from "@components/TreeNode";

// Utils
import useLanguages from "@hooks/useLanguages";
import theme from "@utils/theme.json";
import useTree from "@hooks/useTree";

// React
import { useEffect, useRef, useState } from "react";

const SourceCode = ({ username, projectname }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [explorerData, setExplorerData] = useState({});
  const [focus, setFocus] = useState({
    path: `users/${username}/${projectname}/`,
    isFolder: true,
    input: {
      visible: false,
      isFolder: false,
    },
  });

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const { createFileTree } = useTree();
  const { getLanguage } = useLanguages();

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;

    monaco.editor.defineTheme("syncspace", theme);
    monaco.editor.setTheme("syncspace");
  };

  const fileClick = async (path, folder = false) => {
    if (folder) {
      setFocus({ ...focus, path: path });
      return;
    }

    const fileExtension = path.split(".").pop();
    const fileLanguage = getLanguage(fileExtension);

    setFocus({ ...focus, path: path });

    await getBytes(ref(storage, path))
      .then((res) => {
        const decoder = new TextDecoder();

        editorRef.current.getModel().setValue(decoder.decode(res));
        monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), fileLanguage);

        setShowEditor(true);
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    if (Object.keys(explorerData).length === 0) {
      const data = createFileTree(
        ref(storage, `users/${username}/${projectname}/`),
        `users/${username}/${projectname}/`,
        projectname,
      );
      setExplorerData(data);
    }
  }, [createFileTree, explorerData, projectname, username]);
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <TreeNode
          tree={explorerData}
          explorer={explorerData}
          focusedItem={focus}
          renamedNode="-1"
          handleClick={fileClick}
          setFocusedItem={setFocus}
        />
      </div>
      <div style={{ display: !showEditor && "none", marginTop: "1rem", borderRadius: "0.5rem" }}>
        <Editor
          height="100vh"
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            readOnly: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            wrappingStrategy: "advanced",
            overviewRulerLanes: 0,
          }}
        />
      </div>
    </>
  );
};

export default SourceCode;
