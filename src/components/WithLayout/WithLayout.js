import React from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import TextUploader from "../../components/TextUploader/TextUploader";
import SingleDaySelector from "../SingleDaySelector/SingleDaySelector";

const withLayout = (PageComponent, options) => {
  const { menuComponents, handleSubmit, selectedDay, setSelectedDay } = options;

  return (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          Open Menu
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {menuComponents.map((Component, index) => (
            <MenuItem key={index} onClick={handleClose}>
              <Component />
            </MenuItem>
          ))}
        </Menu>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <SingleDaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
          <PageComponent {...props} />
        </Box>
        <TextUploader handleSubmit={handleSubmit} />
      </Box>
    );
  };
};

export default withLayout;
