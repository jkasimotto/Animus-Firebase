import React from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Creation.module.css";
import ReactMarkdown from "react-markdown";
import articles from "../articles/articles.json";


const Creation = () => {
  const { id } = useParams();
  const idNum = parseInt(id);
  const images = require.context("../images", true);

  // Get the creation from the JSON file
  const creation = articles.find((creation) => creation.id === idNum);

  console.log(creation.markdown)

  const renderers = {
    image: ({ alt, src }) => {
      return <img src={src} alt={alt} className={styles.img} />;
    },
  };

  return (
    <div className={styles.creationContainer}>
      <ReactMarkdown
        className={styles.markdown}
        children={creation.markdown}
        components={{
          img: ({ node, src, alt, ...props }) => (
            <img src={images(src)} alt={alt} style={{ display: "block", textAlign: "center", maxWidth: "80%", maxHeight: "300px", padding: "10px 0"}} />
          ),
        }}
      />
    </div>
  );
};

export default Creation;
