import React from 'react';
import styles from '../styles/About.module.css';
import Markdown from "../articles/about.mdx";

const About = () => {
  return (
    <div className={styles.about}>
      <Markdown />
    </div>
  );
};

export default About;
