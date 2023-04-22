import styles from "./Search.module.scss";

const Search = ({ isSearching, changeSearching }) => {
  return (
    <div className={styles.search}>
      <div className={styles.searchForm}>
        <input
          type="text"
          placeholder="Find a user"
          onInput={() => !isSearching && changeSearching(true)}
          onBlur={() => changeSearching(false)}
        />
      </div>
      {isSearching && (
        <div className={styles.userChat}>
          <img src="planet.svg" alt="altceva" />
          <div className={styles.userChatInfo}>
            <span>Jane</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
