import React from "react";
import { useLocation } from "react-router-dom";

function TokenSlip() {
  const location = useLocation();
  const token = location.state?.token || "N/A";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Order Confirmed</h2>
        <p>Your Token Number</p>

        <div style={styles.token}>{token}</div>

        <p style={styles.text}>
          Please show this token at the cafeteria counter.
        </p>
      </div>
    </div>
  );
}

export default TokenSlip;

/* ========= STYLES ========= */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ecfeff",
    fontFamily: "Arial"
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  token: {
    margin: "20px 0",
    fontSize: "36px",
    fontWeight: "bold",
    color: "#1d4ed8"
  },
  text: {
    color: "#475569"
  }
};
