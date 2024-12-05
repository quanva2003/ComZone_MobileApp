import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);
  const fetchCartData = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      const parsedCart = cartData ? JSON.parse(cartData) : [];
      setCart(parsedCart);
      setCartCount(parsedCart.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  const addToCart = async (newItem) => {
    try {
      // Prevent duplicates
      const isItemExists = cart.some((item) => item.id === newItem.id);
      if (isItemExists) return;

      const updatedCart = [...cart, newItem];
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      setCartCount(updatedCart.length);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = cart.filter((item) => item.id !== itemId);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      setCartCount(updatedCart.length);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        fetchCartData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
