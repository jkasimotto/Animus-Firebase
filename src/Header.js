import React, { useState } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {

  const [imageUrl, setImageUrl] = useState("./images/1.jpeg");

  // function to handle the click on circular image
  const handleImageClick = () => {
    // select a random image from src/images folder
    // const imageKeys = images.keys();
    // const randomImageKey = imageKeys[Math.floor(Math.random() * imageKeys.length)];
    // const imagePath = images(randomImageKey);
    // setImageUrl(imagePath);
  };

  return (
    <header className={styles.header}>
      <div className={styles.circularImageContainer} onClick={handleImageClick}>
        {imageUrl && (
          <div
            className={styles.circularImage}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
        <Link to="/about" className={styles.navLink}>
          About
        </Link>
        <Link to="/articles" className={styles.navLink}>
          Articles
        </Link>
      </nav>
    </header>
  );
};

export default Header;
