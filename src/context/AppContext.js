// src/context/AppContext.js
import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const addToCart = (comic) => {
    setCart((prevCart) => [...prevCart, comic]);
  };

  return (
    <AppContext.Provider value={{ cart, setCart, user, setUser, addToCart }}>
      {children}
    </AppContext.Provider>
  );
};
