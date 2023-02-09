import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../styles/Creations.module.css'
import { Link } from 'react-router-dom';
import articles from '../articles/articles.json';
const images = require.context('../images', true);

const Creations = () => {
  const [creations, setCreations] = useState(articles);

  return (
    <div className={styles.creationsContainer}>
        {creations.map((creation) => (
          <Link to={`/articles/${creation.id}`} key={creation.id}>
            <div className={styles.creationCard}>
              <img src={images(creation.thumbnail)} alt={creation.title} className={styles.thumbnail}/>
              <h2>{creation.title}</h2>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default Creations;

