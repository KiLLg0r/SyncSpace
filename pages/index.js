import Editor from "@monaco-editor/react";
import React from "react";

const Home = () => {
  const [postBody, setPostBody] = React.useState("");

  return (
    <div>
      <Editor height="90vh" language="javascript" theme="vs-dark" value={postBody} onChange={setPostBody} />
    </div>
  );
};

export default Home;