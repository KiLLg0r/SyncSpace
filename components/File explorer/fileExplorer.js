// React
import React, { useEffect, useState } from "react";
import { listAll } from "firebase/storage";
import { File, Folder } from "@components/File/file";

const FolderTree = ({ docRef, onClick }) => {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    if (!docs)
      listAll(docRef)
        .then((res) => {
          setDocs(res);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [docRef, docs]);

  return (
    <>
      {docs?.prefixes?.length > 0 &&
        docs.prefixes.map((doc, index) => (
          <Folder name={doc.name} key={index}>
            <FolderTree docRef={doc} onClick={onClick} />
          </Folder>
        ))}
      {docs?.items?.length > 0 &&
        docs.items.map((doc, index) => <File name={doc.name} key={index} onClick={() => onClick(doc)}></File>)}
    </>
  );
};

const FileExplorer = ({ docRef, onClick }) => {
  return <FolderTree docRef={docRef} onClick={onClick} />;
};

export default React.memo(FileExplorer);
