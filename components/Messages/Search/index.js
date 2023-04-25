import styles from "./Search.module.scss";

// React
import { useState } from "react";
import Image from "next/image";

// Firebase
import { collection, query, where, doc, getDocs, addDoc } from "firebase/firestore";
import { db } from "@config/firebase";

// Store
import useAuthStore from "@store/useAuthStore";
import useChatStore from "@store/useChatStore";

const Search = ({ isSearching, changeSearching }) => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  const cuser = useAuthStore((state) => state.currentUser);

  const changeConversation = useChatStore((state) => state.updateConversation);

  const handleSearch = async () => {
    setError(false);

    const querySnapshot = await getDocs(collection(db, "users"));
    const documents = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        if (doc.data().name.toLowerCase().includes(username.toLowerCase()) && doc.data().name !== cuser.displayName) {
          return { id: doc.id, ...doc.data() };
        }
        return null;
      }),
    );

    const filteredDocs = documents.filter((doc) => doc !== null);

    if (filteredDocs.length === 0) setError(true);
    else setUsers(filteredDocs);
  };

  const handleKey = (e) => {
    e.key === "Enter" && handleSearch();
    if (e.key === "Escape") {
      setUsers([]);
      setUsername("");
      changeSearching(false);
      setError(false);
    }
  };

  const handleSelect = async (user) => {
    try {
      const q = query(
        collection(db, "conversations"),
        where("users", "in", [
          [cuser.displayName, user.name],
          [user.name, cuser.displayName],
        ]),
      );
      const res = await getDocs(q);

      let doc;

      if (res.docs.length === 0)
        doc = await addDoc(collection(db, "conversations"), {
          users: [cuser.displayName, user.name],
          imgs: [
            cuser.photoURL ?? "https://www.odonovan.co.uk/wp-content/uploads/2018/05/Placeholder-image.jpg",
            user.img,
          ],
        });
      else doc = res.docs[0];

      changeConversation(doc.id, user.name, user.img);
    } catch (err) {
      console.log(err);
    }

    setUsers([]);
    setUsername("");
    changeSearching(false);
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchForm}>
        <input
          type="text"
          placeholder="Find a user"
          onInput={() => !isSearching && changeSearching(true)}
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {error && <span style={{ paddingLeft: "0.5rem" }}>User not found!</span>}
      {isSearching &&
        users.length > 0 &&
        users.map((user) => (
          <div className={styles.userChat} key={user.name} onClick={() => handleSelect(user)}>
            <div className={styles.userChatImg}>
              <Image
                src={user.img}
                fill={true}
                alt={`${user.name}'s profile image`}
                style={{ objectFit: "cover" }}
                sizes={"10rem"}
              />
            </div>
            <div className={styles.userChatInfo}>
              <span>{user.name}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Search;
