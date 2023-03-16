import React, { useState, useContext } from "react";
import styles from "../styles/Header.module.css";
import { Link } from "react-router-dom";
import SignInButton from "./SignInButton";
import { AuthContext } from "../auth/auth";
import AudioUpload from "./AudioUpload";

const images = require.context("../images", true);

const Header = () => {
  const [imageUrl, setImageUrl] = useState(getRandomImage());

  // function to handle the click on circular image
  const handleImageClick = () => {
    // Get a random number between 1 and 10
    const randomNum = Math.floor(Math.random() * 10) + 1;
    // Import "randomnumber.jpeg" from the images folder
    const randomImg = require(`../images/${randomNum}.jpeg`);
    // Set the image source to the random image
    setImageUrl(randomImg);
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
        <Link to="/about" className={styles.navLink}>
          About
        </Link>
        <Link to="/articles" className={styles.navLink}>
          Articles
        </Link>
        <Link to="/chat" className={styles.navLink}>
          Chat
        </Link>
        <Link to="/transcript" className={styles.navLink}>
          Transcript
        </Link>
      </nav>
      <SignInButton />
      <AudioUpload />
    </header>
  );
};

// Function to get random image
const getRandomImage = () => {
  // Get a random number between 1 and 10
  const randomNum = Math.floor(Math.random() * 10) + 1;
  // Import "randomnumber.jpeg" from the images folder
  const randomImg = images(`./${randomNum}.jpeg`);
  // Set the image source to the random image
  return randomImg;
};

export default Header;
