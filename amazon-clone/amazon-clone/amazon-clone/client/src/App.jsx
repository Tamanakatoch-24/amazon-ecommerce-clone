import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import PaymentProcessing from "./pages/PaymentProcessing";
import TrackOrder from "./pages/TrackOrder";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Categories from "./pages/Categories";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/success" element={<Success />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;