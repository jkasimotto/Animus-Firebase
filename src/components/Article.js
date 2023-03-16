import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Creation.module.css";
import Article1 from "../articles/dog-colouring-book.mdx";


const articles = {
  1: Article1,
};

const Article = () => {
  const { id } = useParams();
  const idNum = parseInt(id);
  const images = require.context("../images", true);
  const Comp = articles[idNum];

  return (
    <div className={styles.creationContainer}>
      <Comp />
    </div>
  );
};

export default Article;
