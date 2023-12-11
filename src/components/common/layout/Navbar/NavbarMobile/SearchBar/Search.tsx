import React, { useContext, useEffect, } from "react";
import { db } from "../../../../../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from "react-router-dom";
import { useSearchContext } from "../../../../../../context/SearchContext"; 
import { CartContext } from "../../../../../../context/CartContext";
import { Product, CartItem } from '../../../../../../type/type';


const Search: React.FC = () => {
 
  const { addToCart } = useContext(CartContext)!; 
  const { searchKeyword, searchResults, setSearchResults } = useSearchContext()!;


  
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const searchQuery = query(
          productsCollection,
          where("title", ">=", searchKeyword),
          where("title", "<=", searchKeyword + "\uf8ff")
        );
        const querySnapshot = await getDocs(searchQuery);

        const productsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as Product));

        setSearchResults(productsData);
      } catch (error) {
        console.error('Error al obtener productos filtrados:', error);
      }
    };

    if (searchKeyword.trim() !== "") {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchKeyword]);


  
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
    // Crear un objeto CartItem basado en el producto con una cantidad inicial de 1
    const cartItem: CartItem = {
      ...product,
      quantity: 1,
    };
  
    // Llama a la función addToCart del contexto para agregar el producto al carrito
    addToCart(cartItem);
   
  };
 
  return (
    <div>

      {searchResults.length > 0 && (
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            Resultados de tu búsqueda.
          </Typography>
        )}
    
      <Grid container spacing={1} sx={containerStyles}>
      
        {searchResults.map((product) => (
         
          <Grid item xs={6} sm={6} md={6} lg={4} key={product.id}>
            <Card sx={productStyles}>
              <img src={product.images[0]} alt={product.title} style={productImageStyles} />
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
    </div>
 
  );
  
};

export default Search;
