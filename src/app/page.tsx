import NavBar from '../components/NavBar';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <NavBar />
      <p className={styles.boldHeader}>Hello, I&apos;m Kevin</p>
    </>
  );
}