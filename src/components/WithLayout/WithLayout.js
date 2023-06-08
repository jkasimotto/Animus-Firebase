import React from "react";
import { Box, Button, Grid, Divider } from "@mui/material";
import TextUploader from "../../components/TextUploader/TextUploader";
import SingleDaySelector from "../SingleDaySelector/SingleDaySelector";
import ScrollableSidebar from "../ScrollableSidebar/ScrollableSidebar";

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
        <Box>
          <Grid container spacing={2}>
            {menuComponents.map((Component, index) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Component />
                </Box>
              </Grid>
            ))}
            <Grid item xs={6} sm={6} md={4} lg={3}>
              <SingleDaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            </Grid>
          </Grid>
        </Box>
        <TextUploader handleSubmit={handleSubmit} />
      </Box>
    );
  };
};

export default withLayout;
