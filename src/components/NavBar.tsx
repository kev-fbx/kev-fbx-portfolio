import React from "react";
import Link from "next/link";
import styles from "./NavBar.module.css";

export default function NavBar() {
    return (
        <header className={styles.navWrapper}>
            <div className={styles.navBar}>
                <nav>
                    <ul className={styles.navList}>
                        <li><Link href="/">HOME</Link></li>
                        <li><Link href="/projects">PROJECTS</Link></li>
                        <li><Link href="/gallery">GALLERY</Link></li>
                        <li><Link href="/about">ABOUT</Link></li>
                        <li><Link href="/contact">CONTACT</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
