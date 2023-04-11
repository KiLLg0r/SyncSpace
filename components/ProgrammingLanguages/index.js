import { storage } from "@config/firebase";
import { ref } from "firebase/storage";

import useLanguages from "@hooks/useLanguages";

import styles from "./ProgrammingLanguages.module.scss";

const ProgrammingLanguages = async ({ username, projectName }) => {
  const { getUsedLanguages, getLanguageColor } = useLanguages();

  const languages = await getUsedLanguages(ref(storage, `/users/${username}/${projectName}`));
  return (
    Object.keys(languages).length > 0 && (
      <>
        <div className={styles.label}>Languages used</div>
        <div className={styles.languages}>
          {Object.keys(languages).map((key) => {
            return (
              <span key={key} className={styles.language}>
                <div className={styles.color} style={{ background: `${getLanguageColor(key).color}` }}></div>
                {getLanguageColor(key).name}
              </span>
            );
          })}
        </div>
      </>
    )
  );
};

export default ProgrammingLanguages;
