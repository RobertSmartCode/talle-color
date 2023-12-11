import React, { useState } from "react";
import OrderDetails from './OrderDetails';

import {
  Button,
  IconButton,
  Drawer,
  Box,
  Typography,
 
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";



const customColors = {
    primary: {
      main: '#000',
      contrastText: '#000',
    },
    secondary: {
      main: '#fff',
      contrastText: '#fff',
    },
  };

  const topBarStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row", 
    padding: "12px 8px",
    width: "100%",
    margin: "0 auto", 
    backgroundColor: customColors.primary.main,
    color: customColors.secondary.main,
  };

  const closeButtonStyles = {
    color: customColors.secondary.main,
    marginRight: '2px',
    marginLeft: '0',
    fontSize: '24px',
  };

  const textStyles = {
    fontSize: '20px',
    color: customColors.secondary.main,
    marginLeft: '24px',
  };

const MyOrders: React.FC = () => {
 
  const [open, setOpen] = useState(false);


  const handleBtnClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  


  return (
    <Box>
      <Button 
      variant="contained"
      onClick={handleBtnClick}
      sx={{
        backgroundColor: customColors.primary.main,
        color: customColors.secondary.contrastText,
      }}
      >
        Mis Ordenes
      </Button>

      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
        sx={{
          display: { xs: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            zIndex: 1300,
          },
        }}
      >
        <Box sx={topBarStyles}>
          <Typography sx={textStyles}>Mis Ordenes</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={closeButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>
       <OrderDetails/>
      </Drawer>

    </Box>
  );
};

export default MyOrders;
