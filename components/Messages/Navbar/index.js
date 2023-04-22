import styles from "./Navbar.module.scss"

const Navbar = () => {
  return ( 
    <div className={styles.navbar}>
      <span className={styles.logo}>SyncSpace</span>
      <div className={styles.user}></div>
      <span>John</span>
      <img src="planet.svg"alt="planet" />
      <button>Logout</button>
    </div>
   );
}
 
export default Navbar;