import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterProduct from "./FilterProducts"; 
import { useFilterContext } from "../../context/FilterContext";
import { useSortContext } from "../../context/SortContext";

import AppliedFilters from "./AppliedFilters"; 
import { Product} from '../../type/type';
import { useTheme, useMediaQuery } from '@mui/material';
import Filter from "./Filter";

import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";



const Shop: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { filter } = useFilterContext()!;
  const { sort } = useSortContext()!;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isComponentReady, setIsComponentReady] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);


  const handleImageLoad = () => {
    // Incrementa el contador de imágenes cargadas
    setLoadedImageCount((prevCount) => {
      const newCount = prevCount + 1;
      return newCount;
    });
  };
  

  useEffect(() => {

 
    if (loadedImageCount >= allProducts.length) {
      // Actualiza el estado para permitir el renderizado
      setIsComponentReady(true);
    }
  }, [loadedImageCount, allProducts]);
  

  

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productsQuery = query(productsCollection);

      try {
        const querySnapshot = await getDocs(productsQuery);
        const productsData = querySnapshot.docs.map(
          (doc) => ({
            ...doc.data(),
            id: doc.id,
          } as Product)
        );

        setAllProducts(productsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFiltersAndSort = () => {
      let filteredProducts = [...allProducts];

      // ... (código anterior de filtrado)

      setProducts(filteredProducts);
    };

    applyFiltersAndSort();
  }, [filter, sort, allProducts]);

  useEffect(() => {
    if (!filter.colors && !filter.sizes) {
      setProducts(allProducts);
    }
  }, [filter, allProducts]);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
  };

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

  return (
    <div>
      {isComponentReady && (
        <Grid container spacing={2} sx={containerStyles}>
          <Grid item xs={12} md={isMobile ? 3 : 2} lg={isMobile ? 3 : 2}>
            {isMobile ? (
              <Grid container spacing={2} justifyContent="left" sx={{ marginLeft: 1 }}>
                <FilterProduct />
              </Grid>
            ) : (
              <Filter />
            )}
            {isMobile && (
              <Grid container spacing={2} justifyContent="left" sx={{ margin: 1, marginTop: 1 }}>
                <AppliedFilters />
              </Grid>
            )}
          </Grid>

          <Grid item container xs={12} md={isMobile ? 9 : 10} lg={isMobile ? 9 : 10} spacing={1}>
            {products.map((product) => (
              <Grid item xs={6} sm={4} md={3} lg={3} key={product.id}>
                <Card sx={productStyles}>
                  {selectedProduct ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        style={productImageStyles}
                        loading="lazy"  // Cambiado a "lazy" ya que ahora gestionamos la carga con el contador
                        className="lazy-load-image"
                        onLoad={handleImageLoad}  // Agregado el manejador de carga de imágenes
                      />

                      <SelectionCard
                        isOpen={true}
                        onClose={() => setSelectedProduct(null)}
                        handleBuyClick={handleBuyClick}
                        product={product}
                        style={{ position: 'absolute', top: '-100px', left: 0, zIndex: 1 }}
                      />
                    </div>
                  ) : (
                    <>
                      <img
                      src={product.images[0]}
                      alt={product.title}
                      style={productImageStyles}
                      loading="lazy"  // Cambiado a "lazy" ya que ahora gestionamos la carga con el contador
                      className="lazy-load-image"
                      onLoad={handleImageLoad}  // Agregado el manejador de carga de imágenes
                    />


                    </>
                  )}
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
        </Grid>
      )}
    </div>
  );
};

export default Shop;


