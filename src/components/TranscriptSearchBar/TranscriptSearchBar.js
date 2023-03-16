import React from 'react';
import { TextField, Button } from '@mui/material';
import styles from './TranscriptSearchBar.module.css';

function TranscriptSearchBar(props) {
  const { searchTerm, onSearch } = props;

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <TextField
        className={styles.searchTextField}
        label="Search transcripts"
        variant="outlined"
        value={searchTerm}
        onChange={(event) => props.onSearchTermChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button className={styles.searchButton} variant="contained" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
}

export default TranscriptSearchBar;
