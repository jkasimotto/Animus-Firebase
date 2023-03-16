import React, { useState } from "react";
import { TextField } from "@mui/material";

const SearchComponent = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleClear = () => {
    setSearchText("");
    onSearch("");
  };

  return (
    <TextField
      label="Search"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      InputProps={{
        endAdornment: searchText && (
          <i className="material-icons" onClick={handleClear}>
            clear
          </i>
        ),
      }}
      fullWidth
      margin="normal"
      variant="outlined"
    />
  );
};

export default SearchComponent;
