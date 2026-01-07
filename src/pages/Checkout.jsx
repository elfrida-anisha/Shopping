import React from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = () => {
    const token = Math.floor(1000 + Math.random() * 9000);
    navigate("/token", { state: { cart, total, token } });
  };

  return (
    <div className="container">
      <h2>Checkout</h2>

      {cart.map((item, index) => (
        <div className="cart-item" key={index}>
          <img src={item.image} alt={item.name} />
          <div>
            <strong>{item.name}</strong>
            <div>₹{item.price}</div>
          </div>
        </div>
      ))}

      <div className="total">Total: ₹{total}</div>

      <button className="pay-btn" onClick={handlePayment}>
        Proceed to Payment
      </button>
    </div>
  );
}

export default Checkout;
