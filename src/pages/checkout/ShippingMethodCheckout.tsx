import { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Grid,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { CartContext } from "../../context/CartContext";

import { ShippingMethod } from "../../type/type";

const SHIPPING_METHODS_STORAGE_KEY = "shippingMethods";

const ShippingMethodCheckout = () => {
  const { updateShippingInfo, getSelectedShippingMethod } =
    useContext(CartContext)!;

  const initialSelectedMethod = getSelectedShippingMethod();

  const [methods, setMethods] = useState<ShippingMethod[]>([]);

  const onSelectMethod = (method: ShippingMethod) => {
    updateShippingInfo(method, method.price);
  };

  const [showAllOptions, setShowAllOptions] = useState(false);

  useEffect(() => {
    const storedMethods = JSON.parse(
      localStorage.getItem(SHIPPING_METHODS_STORAGE_KEY) || "[]"
    );

    if (storedMethods.length > 0) {
      setMethods(storedMethods);
    } else {
      fetchShippingMethods();
    }
  }, []);

  useEffect(() => {
    if (initialSelectedMethod) {
      const initialMethod = methods.find(
        (m) => m.id === initialSelectedMethod.id
      );
      if (initialMethod) {
        initialMethod.selected = true;
        saveMethodsToLocalStorage();
      }
    }
  }, [initialSelectedMethod, methods]);

  const fetchShippingMethods = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shippingMethods"));
      const methodsData: ShippingMethod[] = [];

      querySnapshot.forEach((doc) => {
        const methodData = doc.data();
        if (methodData.name && methodData.price) {
          methodsData.push({
            id: doc.id,
            name: methodData.name,
            price: methodData.price,
            selected: false,
          });
        }
      });

      setMethods(methodsData);
    } catch (error) {
      console.error("Error al obtener los métodos de envío:", error);
    }
  };

  const handleMethodClick = (method: ShippingMethod) => {
    const updatedMethods = methods.map((m) => ({
      ...m,
      selected: m.id === method.id,
    }));
    setMethods(updatedMethods);

    onSelectMethod(method);

    setShowAllOptions(false);
  };

  const saveMethodsToLocalStorage = () => {
    localStorage.setItem(
      SHIPPING_METHODS_STORAGE_KEY,
      JSON.stringify(methods)
    );
  };

  return (
    <Box>
      <Grid container spacing={0}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h6"
            align="center"
            style={{
              fontWeight: "bold",
              color: "black",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowAllOptions(false);
            }}
          >
            Método de Envío
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        {methods.map((method) => (
          <Grid item xs={12} sm={12} md={12} lg={12} key={method.id}>
            {showAllOptions || method.selected ? (
              <Card
                onClick={() => handleMethodClick(method)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: method.selected ? "#e0e0e0" : "white",
                  display: "flex",
                  flexDirection: "column",
                  '@media (min-width:600px)': {
                    maxWidth: '500px',
                    margin: 'auto',
                  },
                }}
              >
                <CardContent
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={method.selected}
                      onChange={() => handleMethodClick(method)}
                      style={{ marginRight: "10px" }}
                    />
                    <Typography
                      variant="body1"
                      component="div"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {method.name}
                    </Typography>
                  </div>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    style={{ paddingRight: "35px" }}
                  >
                    ${method.price}
                  </Typography>
                </CardContent>
              </Card>
            ) : null}
          </Grid>
        ))}

        {!showAllOptions && (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "0",
              padding: "0",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowAllOptions(true)}
              sx={{
                border: "none",
                margin: "0",
                padding: "0",
                textTransform: "none",
              }}
            >
              Más opciones <ExpandMoreIcon />
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ShippingMethodCheckout;
