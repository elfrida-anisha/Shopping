import React, { useState } from "react";
import menu from "../data/menu.jsx";

function Home({ addToCart }) {
  const [activeId, setActiveId] = useState(null);

  const handleAdd = (item) => {
    addToCart(item);
    setActiveId(item.id);
    setTimeout(() => setActiveId(null), 300);
  };

  return (
    <div className="container">
      <h2>Available Items</h2>

      <div className="menu-grid">
        {menu.map(item => (
          <div className="menu-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

            <button
              style={{
                backgroundColor:
                  activeId === item.id ? "#4ade80" : "#065f46"
              }}
              onClick={() => handleAdd(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
