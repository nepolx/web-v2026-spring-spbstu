import { CartContext } from "./CartContext";
import { useCart } from "../hooks/useCart";

export const CartProvider = ({ children }) => {
  const cartApi = useCart();
  return <CartContext.Provider value={cartApi}>{children}</CartContext.Provider>;
};