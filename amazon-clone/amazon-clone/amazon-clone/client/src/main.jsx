import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import CartProvider from "./context/CartContext.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import WishlistProvider from "./context/WishlistContext.jsx";
import OrderProvider from "./context/OrderContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <OrderProvider>
        <WishlistProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </WishlistProvider>
      </OrderProvider>
    </AuthProvider>
  </React.StrictMode>
);