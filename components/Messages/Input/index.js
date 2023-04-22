import styles from "./Input.module.scss";

const Input = () => {
  return (
    <div className={styles.input}>
      <input type="text" placeholder="Type something..." />
      <div className={styles.send}>
        <input type="file" style={{ display: "none" }} id="file" />
        <label htmlFor="file">
          <img src="planet.svg" alt="icon" />
        </label>
        <input type="file" style={{ display: "none" }} id="img" accept={"image/*"}/>
        <label htmlFor="img">
          <img src="planet.svg" alt="icon" />
        </label>
        <button>Send</button>
      </div>
    </div>
  );
}

export default Input;
