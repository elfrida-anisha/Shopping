import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/menu");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1f2937",
        color: "white",
        flexDirection: "column"
      }}
    >
      <h1>College Cafeteria</h1>
      <p>Pre-Order System</p>
    </div>
  );
}

export default Splash;
