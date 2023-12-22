// NewArrivals.tsx
import React, { useEffect, useState} from "react";
import { db } from "../../firebase/firebaseConfig";
import { getDocs, collection, orderBy, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Product } from "../../type/type";
import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";

const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isComponentReady, setIsComponentReady] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

const handleImageLoad = () => {
  // Incrementa el contador de imágenes cargadas
  setLoadedImageCount((prevCount) => {
    const newCount = prevCount + 1;
    return newCount;
  });
};


useEffect(() => {


  if (loadedImageCount >= products.length) {
    // Actualiza el estado para permitir el renderizado
    setIsComponentReady(true);
  }
}, [loadedImageCount, products]);

 

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const productCollection = collection(db, "products");
        const productQuery = query(productCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(productQuery);

        const newArrivals = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Product));

        setProducts(newArrivals);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    fetchNewArrivals();
  }, []);


  // Colores personalizados
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

  // Estilos con enfoque sx
  const containerStyles = {
    padding: '8px',
    marginTop:"20px"
  };

  const productStyles = {
    border: "1px solid gray",
    padding: '8px',
    marginBottom: '8px',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: customColors.secondary.main,
    color: customColors.primary.main,
  };

  const productImageStyles = {
    width: "100%", 
    marginBottom: '8px',
    borderBottom: "1px solid #000",
  };
  

  const productTitleStyles = {
    fontSize: "1rem",
    fontWeight: "bold",
  };

  const productPriceStyles = {
    fontSize: "1.2rem",
    color: customColors.primary.main,
    marginBottom: '16px',
  };

  const productDetailStyles = {
    backgroundColor: customColors.secondary.main,
    color: customColors.primary.main,
    border: `2px solid ${customColors.primary.main}`,
    borderRadius: '50%',
    padding: '8px',
  };

  const iconStyles = {
    fontSize: '1rem',
  };

  const productCartStyles = {
    backgroundColor:customColors.primary.main,
    color:customColors.secondary.main,
  };

  const buttonContainerStyles = {
    display: "flex",
    gap: '8px',
    marginTop: '16px',
    marginLeft: '32px',
    marginRight: '32px',
    marginBottom: '0px',
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
  };
  

  return (

    <div>
       {isComponentReady && (
   
    <Grid container spacing={2} sx={containerStyles}>
      {/* Título responsivo */}
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h4">Nuevos Ingresos</Typography>
      </Grid>
  
      {/* Productos más vendidos */}
      {products.map((product) => (
        <Grid item xs={6} sm={4} md={4} lg={3} key={product.id}>
          <Card sx={productStyles}>
            <img 
            src={product.images[0]}
            alt={product.title}
            style={productImageStyles}
            onLoad={handleImageLoad} 
            />
             {selectedProduct === product ?  (
                  <SelectionCard
                    isOpen={true}
                    onClose={() => setSelectedProduct(null)}
                    handleBuyClick={handleBuyClick}
                    product={product}
                   
                  />
                ) : null}
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={productTitleStyles}>
                {product.title}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" sx={productPriceStyles}>
                Precio: ${product.unit_price}
              </Typography>
              <Box sx={buttonContainerStyles}>
                <Button
                  onClick={() => handleBuyClick(product)} 
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={productCartStyles}
                >
                  Comprar
                </Button>
                <IconButton
                  component={Link}
                  to={`/itemDetail/${product.id}`}
                  aria-label="Ver"
                  color="secondary"
                  size="small"
                  sx={productDetailStyles}
                >
                  <VisibilityIcon sx={iconStyles} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
      )}
    </div>
  );
  

};

export default NewArrivals;
