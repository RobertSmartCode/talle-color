import  { useContext, useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  
} from '@mui/material';
import { CartContext } from '../../../../../../context/CartContext';

import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Product } from '../../../../../../type/type';

const CartItemList = () => {
  const { cart, deleteById, updateQuantityById } = useContext(CartContext)! || {};
  const [productQuantities, setProductQuantities] = useState<{ [combinedKey: string]: number }>({});

  // Función para calcular el subtotal sin envío
  const calculateSubtotal = () => {
    let subtotal = 0;
  
    cart.forEach((product) => {
      const combinedKey = `${product.id}-${product.selectedColor}-${product.selectedSize}`;
      const productQuantity = productQuantities[combinedKey];
      
      const originalPrice = product?.unit_price || 0;
      const discountPercentage = product?.discount || 0;
      const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
  
      subtotal += discountedPrice * productQuantity;
    });
  
    return subtotal;
  };
  


  useEffect(() => {
    // Inicializa los contadores para cada producto en el carrito
    const initialQuantities: { [combinedKey: string]: number } = {};
    cart.forEach((product) => {
      const combinedKey = `${product.id}-${product.selectedColor}-${product.selectedSize}`;
      initialQuantities[combinedKey] = product.quantity;
    });
    setProductQuantities(initialQuantities);
  }, [cart]);

  const handleCounterChange = (productId: string, value: number, color: string, size: string) => {
    if (value >= 1) {
      const combinedKey = `${productId}-${color}-${size}`;
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [combinedKey]: value,
      }));

      updateQuantityById(productId, value, color, size);
    }
  };
  

const calculateFinalPrice = (product: Product): number => {
  const originalPrice = product?.unit_price || 0;
  const discountPercentage = product?.discount || 0;
  return originalPrice - (originalPrice * (discountPercentage / 100));
};


return (
  <Card style={{ marginTop: '-40px' }}>
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" style={{ textAlign: 'center'}}>Productos en el Carrito</Typography>
        </Grid>
        {cart?.length ?? 0 > 0 ? (
          <>
            {cart?.map((product) => (
              <Grid item xs={12} key={`${product.id}-${product.selectedColor}-${product.selectedSize}`}>
                <Card>
                  <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          style={{
                            width: '80%',
                            maxHeight: '100px',
                            objectFit: 'contain',
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          style={{ textAlign: 'center', marginBottom: '30px' }}
                        >
                          {` ${product.title} (${product.selectedColor}, ${product.selectedSize})`}
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={1}
                        >
                          <IconButton
                            color="primary"
                            onClick={() => {
                              const combinedKey = `${product.id}-${product.selectedColor}-${product.selectedSize}`;
                              const newValue = productQuantities[combinedKey] - 1;
                              handleCounterChange(product.id, newValue, product.selectedColor, product.selectedSize );
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body2">
                            {productQuantities[`${product.id}-${product.selectedColor}-${product.selectedSize}`]}
                          </Typography>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              const combinedKey = `${product.id}-${product.selectedColor}-${product.selectedSize}`;
                              const newValue = productQuantities[combinedKey] + 1;
                              handleCounterChange(product.id, newValue, product.selectedColor, product.selectedSize );
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Stack>
                      </Grid>
                      <Grid item xs={4} style={{ textAlign: 'right', }}>
                        <Typography variant="body1" style={{ marginBottom: '30px', paddingRight: '15px'  }}>
                          ${calculateFinalPrice(product) *  productQuantities[`${product.id}-${product.selectedColor}-${product.selectedSize}`]}
                        </Typography>
                        <CardActions>
                          <IconButton
                            color="primary"
                            onClick={() => deleteById && deleteById(product.id, product.selectedColor, product.selectedSize)}
                            style={{ paddingLeft: '40px'  }}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <Typography variant="body2" style={{ paddingLeft: '20px' }}>
                Sub Total (Sin Envío)
              </Typography>
              <Typography variant="body1" style={{ paddingRight: '30px' }}>
                ${calculateSubtotal()}
              </Typography>
            </Grid>
          </>
        ) : (
          <Typography>El carrito está vacío</Typography>
        )}
      </Grid>
    </CardContent>
  </Card>
);



};

export default CartItemList;
