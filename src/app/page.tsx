import styles from "./page.module.css";
import NavBar from '../components/NavBar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <NavBar />
      <h1>Home</h1>
    </>
  );
}