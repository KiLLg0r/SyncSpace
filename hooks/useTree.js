import { listAll, uploadString, ref, deleteObject, uploadBytes, getBytes } from "firebase/storage";
import { storage } from "@config/firebase";

const useTree = () => {
  const createFileTree = (ref, initialPath, projectName) => {
    let docs = {
      id: 0,
      type: "folder",
      name: projectName,
      fullPath: initialPath,
      folders: [],
      files: [],
    };
    let id = 1;

    const getDocsRecursive = (ref, docs) => {
      listAll(ref)
        .then((res) => {
          res.prefixes.forEach((folder) => {
            docs.folders.push({
              id: id++,
              name: folder.name,
              fullPath: folder.fullPath,
              type: "folder",
              folders: [],
              files: [],
            });
            getDocsRecursive(folder, docs.folders[docs.folders.length - 1]);
          });

          res.items.forEach((file) => {
            docs.files.push({
              id: id++,
              name: file.name,
              fullPath: file.fullPath,
              type: "file",
              folders: [],
              files: [],
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getDocsRecursive(ref, docs);

    return docs;
  };

  const orderTree = (docs) => {
    const sortFn = (a, b) =>
      a.type === b.type
        ? a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : a.name.toLowerCase() < b.name.toLowerCase()
          ? -1
          : 0
        : 0;

    const recursiveIteration = (arr) => {
      arr.folders.sort(sortFn);
      arr.files.sort(sortFn);
      arr.folders.forEach((el) => recursiveIteration(el));
    };

    recursiveIteration(docs);

    return docs;
  };

  const insertNode = (tree, folderId, item, isFolder, path) => {
    if (tree.id === folderId && tree.type === "folder") {
      const fullPath = isFolder ? `${path}/${item}/‎` : `${path}/${item}`;
      const newNode = {
        id: new Date().getTime(),
        name: item,
        type: isFolder ? "folder" : "file",
        fullPath: fullPath,
        folders: [],
        files: [],
      };

      if (isFolder) tree.folders.unshift(newNode);
      else tree.files.unshift(newNode);

      const storageRef = ref(storage, fullPath);

      uploadString(storageRef, "");

      return tree;
    }

    let latestNode = [];
    latestNode = tree.folders.map((node) => {
      return insertNode(node, folderId, item, isFolder, path);
    });

    return { ...tree, folders: latestNode };
  };

  const findNodePath = (docs, folderId) => {
    let path = "";
    const recursiveIteration = (arr) => {
      arr.forEach((el) => {
        if (el.id === folderId) path = el.fullPath;
        else if (el.type === "folder") recursiveIteration(el.folders);
      });
    };

    recursiveIteration(docs.folders);

    return path || docs.fullPath;
  };

  const deleteNode = (tree, id) => {
    const indexInFiles = tree.files.findIndex((el) => el.id === id);
    const indexInFolders = tree.folders.findIndex((el) => el.id === id);

    const deleteFile = (path) => {
      const storageRef = ref(storage, path);

      deleteObject(storageRef).catch((error) => console.log(error));
    };

    const deleteFolder = (path) => {
      const storageRef = ref(storage, path);
      listAll(storageRef)
        .then((dir) => {
          dir.items.forEach((fileRef) => deleteFile(fileRef.fullPath));
          dir.prefixes.forEach((folderRef) => deleteFolder(folderRef.fullPath));
        })
        .catch((error) => console.log(error));
    };

    if (indexInFiles !== -1) {
      deleteFile(tree.files[indexInFiles].fullPath);

      tree.files.splice(indexInFiles, 1);
      return tree;
    }

    if (indexInFolders !== -1) {
      deleteFolder(tree.folders[indexInFolders].fullPath);

      tree.folders.splice(indexInFolders, 1);
      return tree;
    }

    let latestNode = [];
    latestNode = tree.folders.map((node) => {
      return deleteNode(node, id);
    });

    return { ...tree, folders: latestNode };
  };

  const renameNode = (tree, id, newName, yjsDocs) => {
    const indexInFiles = tree.files.findIndex((el) => el.id === id);
    const indexInFolders = tree.folders.findIndex((el) => el.id === id);

    const renameFile = async (path, newPath) => {
      const storageRef = ref(storage, path);
      const newStorageRef = ref(storage, newPath);

      const removedStorageName = path.substring(path.indexOf("/") + 1);
      const removedUsername = removedStorageName.substring(removedStorageName.indexOf("/") + 1);
      const removedProjectName = removedUsername.substring(removedUsername.indexOf("/") + 1);

      let content = null;

      if (yjsDocs.has(removedProjectName)) {
        const encoder = new TextEncoder();
        content = encoder.encode(yjsDocs.get(removedProjectName).toString());
      } else
        await getBytes(storageRef)
          .then((res) => (content = res))
          .catch((error) => alert(error));

      uploadBytes(newStorageRef, content).then(() => {
        deleteObject(storageRef).catch((error) => console.log(error));
      });
    };

    const renameFolder = (path, newPath) => {
      const storageRef = ref(storage, path);

      listAll(storageRef)
        .then((dir) => {
          dir.items.forEach((fileRef) => {
            const newFilePath = fileRef.fullPath.replace(path, newPath);
            renameFile(fileRef.fullPath, newFilePath);
          });
          dir.prefixes.forEach((folderRef) => {
            const newFolderPath = folderRef.fullPath.replace(path, newPath);
            renameFolder(folderRef.fullPath, newFolderPath);
          });
        })
        .catch((error) => console.log(error));
    };

    if (indexInFiles !== -1) {
      const newPath = tree.files[indexInFiles].fullPath.replace(tree.files[indexInFiles].name, newName);

      renameFile(tree.files[indexInFiles].fullPath, newPath);

      tree.files[indexInFiles].name = newName;
      tree.files[indexInFiles].fullPath = newPath;

      return tree;
    }

    if (indexInFolders !== -1) {
      const newPath = tree.folders[indexInFolders].fullPath.replace(tree.folders[indexInFolders].name, newName);

      renameFolder(tree.folders[indexInFolders].fullPath, newPath);

      tree.folders[indexInFolders].name = newName;
      tree.folders[indexInFolders].fullPath = newPath;

      return tree;
    }

    let latestNode = [];
    latestNode = tree.folders.map((node) => {
      return renameNode(node, id, newName, yjsDocs);
    });

    return { ...tree, folders: latestNode };
  };

  const checkForExistingNameInCurrentNode = (tree, name) => {
    const indexInFiles = tree.files.findIndex((el) => el.name === name);
    const indexInFolders = tree.folders.findIndex((el) => el.name === name);

    if (indexInFiles !== -1) return true;
    if (indexInFolders !== -1) return true;

    return false;
  };

  const checkForExistingName = (tree, name) => {
    if (!checkForExistingNameInCurrentNode(tree, name)) {
      tree.folders.map((node) => {
        return checkForExistingName(node, name);
      });
    } else return true;
  };

  return {
    createFileTree,
    orderTree,
    insertNode,
    findNodePath,
    deleteNode,
    renameNode,
    checkForExistingNameInCurrentNode,
    checkForExistingName,
  };
};

export default useTree;
