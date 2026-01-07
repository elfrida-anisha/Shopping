import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import TokenSlip from "./pages/TokenSlip";
import Entry from "./pages/Entry";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Entry />} />

        <Route
          path="/menu"
          element={
            <>
              <Navbar cartCount={cart.length} />
              <Home addToCart={addToCart} />
            </>
          }
        />

       
        <Route
          path="/checkout"
          element={
            <>
              <Navbar cartCount={cart.length} />
              <Checkout cart={cart} />
            </>
          }
        />

      
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/token" element={<TokenSlip />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
