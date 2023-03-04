// React
import React, { useEffect, useState } from "react";
import { listAll } from "firebase/storage";
import { File, Folder } from "@components/File";
import styles from "../File/File.module.scss";

const FolderTree = ({ docRef, onClick, focusedItem, rightClick }) => {
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
          <Folder
            name={doc.name}
            key={index}
            onClick={() => onClick(doc, true)}
            focused={focusedItem === doc.fullPath}
            rightClick={(e) => rightClick(e, doc.fullPath, true)}
          >
            <FolderTree docRef={doc} onClick={onClick} focusedItem={focusedItem} rightClick={rightClick} />
          </Folder>
        ))}
      {docs?.items?.length > 0 &&
        docs.items.map(
          (doc, index) =>
            doc.name !== "‎" && (
              <File
                name={doc.name}
                key={index}
                onClick={() => onClick(doc)}
                focused={focusedItem === doc.fullPath}
                rightClick={(e) => rightClick(e, doc.fullPath)}
              ></File>
            ),
        )}
    </>
  );
};

const FileExplorer = ({ docRef, onClick, focusedItem, rightClick }) => {
  return (
    <div className={styles.container}>
      <FolderTree docRef={docRef} onClick={onClick} focusedItem={focusedItem} rightClick={rightClick} />
    </div>
  );
};

export default React.memo(FileExplorer);
