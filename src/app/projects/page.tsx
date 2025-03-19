import React from "react";
import styles from './projects.module.css';

const Projects = () => {
  return (
    <>
      <div>
        <h1 className={styles.projects}>Projects coming soon :)</h1>
      </div>
      <div>
        <ul>
          <li>CISSAxUMGMC Game Jam</li>
          <li>LEIDO YouTube Channel</li>
          <li>Client Work</li>
        </ul>
      </div>
    </>
  );
}

export default Projects;