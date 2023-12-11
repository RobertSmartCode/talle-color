import { useContext,  } from "react";
import { Typography, Button, Card, CardContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit'; 
const UserInfo = () => {
  const { getCustomerInformation, getSelectedShippingMethod } = useContext(CartContext)!;
  const customerInfo = getCustomerInformation();
  const selectedShippingMethod = getSelectedShippingMethod();



  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/checkout");
  };


  return (
    <Card
        sx={{
          margin: 'auto',
          maxWidth: '280px',
          padding: '24px',
          '@media (min-width:600px)': {
            maxWidth: '450px',
          },
        }}
>
      <CardContent style={{ position: "relative" }}>
      <Button
          variant="contained"
          style={{
            color: "black",
            backgroundColor: "white",
            position: "absolute",
            top: "1px",
            right: "1px",
            borderRadius: "50%", // Bordes redondos
          }}
          onClick={handleEditClick}
        >
          <EditIcon fontSize="medium" /> {/* Icono de edición más pequeño */}
        </Button>
        <Typography variant="h6" gutterBottom>
          Información de Envío
        </Typography>
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            alignItems="center"
            marginBottom="8px"
            style={{ color: "black" }}
          >
            <MailOutlineIcon  style={{ marginRight: "8px" }} />
            <Typography>{customerInfo?.email}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            marginBottom="8px"
            style={{ color: "black" }}
          >
            <LocationOnIcon  style={{ marginRight: "8px" }}/>
            <Typography>
              {customerInfo?.streetAndNumber}, {customerInfo?.city},{" "} Código Postal:
              {customerInfo?.postalCode}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            marginBottom="8px"
            style={{ color: "black" }}
          >
            <PhoneIcon  style={{ marginRight: "8px" }} />
            <Typography>{customerInfo?.phone}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            style={{ color: "black" }}
          >
            <LocalShippingIcon  style={{ marginRight: "8px" }} />
            <Typography>
              {selectedShippingMethod
                ? selectedShippingMethod.name
                : "No seleccionado"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
