import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";


const Cart: React.FC = () => {
  const { cart, clearCart, deleteById, getTotalPrice } = useContext(CartContext) ?? {};

  let total = getTotalPrice ? getTotalPrice() : 0;
  return (
    <div>
      <h1>Estoy en el carrito</h1>
      {cart && cart.length > 0 && <Link to="/checkout" style={{ color: "steelblue" }}>Finalizar compra</Link>}
      {cart?.map((product) => {
        return (
          <div key={product.id} style={{ width: "200px", border: "2px solid red" }}>
            <h6>{product.title}</h6>
            <h6>{product.quantity}</h6>
            <button onClick={() => deleteById && deleteById(product.id, product.selectedColor,product.selectedSize)}>Eliminar</button>

          </div>
        );
      })}
      <h5>El total a pagar es {total}</h5>
      <button onClick={clearCart}>Limpiar carrito</button>
    </div>
  );
};

export default Cart;

