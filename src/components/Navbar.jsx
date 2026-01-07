import React from "react";
import { Link } from "react-router-dom";

function Navbar({ cartCount }) {
  return (
    <div className="navbar padding-10">
      <strong>College Cafeteria Pre-Order</strong>

      <div>
        
        <Link to="/checkout">Cart ({cartCount})</Link>
      </div>
    </div>
  );
}

export default Navbar;
