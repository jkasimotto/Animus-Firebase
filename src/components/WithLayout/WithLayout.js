import React from "react";
import { Box, Button, Grid, Divider } from "@mui/material";
import TextUploader from "../../components/TextUploader/TextUploader";
import SingleDaySelector from "../SingleDaySelector/SingleDaySelector";
import ScrollableSidebar from "../ScrollableSidebar/ScrollableSidebar";
import BottomNav from "../BottomNav/BottomNav";

const withLayout = (PageComponent, options) => {
  const { menuComponents, handleSubmit, selectedDay, setSelectedDay } = options;

  return (props) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <PageComponent {...props} />
        </Box>
        <Divider />
        <BottomNav menuComponents={menuComponents} />
      </Box>
    );
  };
};

export default withLayout;
