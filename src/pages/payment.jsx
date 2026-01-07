import React from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  const handlePayment = () => {
    // simulate successful payment
    const token = "CF" + Math.floor(100 + Math.random() * 900);

    navigate("/token", {
      state: { token }
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Payment</h1>

      <div style={styles.card}>
        <h3>Choose Payment Method</h3>

        <div style={styles.option}>UPI</div>
        <div style={styles.option}>Credit / Debit Card</div>
        <div style={styles.option}>Net Banking</div>

        <button onClick={handlePayment} style={styles.payBtn}>
          Pay Now
        </button>

        <p style={styles.note}>
          * Cash on Delivery not allowed
        </p>
      </div>
    </div>
  );
}

export default Payment;

/* ========= STYLES ========= */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    width: "360px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  heading: {
    marginBottom: "20px",
    color: "#0f172a"
  },
  option: {
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #cbd5f5",
    borderRadius: "8px",
    cursor: "pointer"
  },
  payBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer"
  },
  note: {
    marginTop: "15px",
    fontSize: "12px",
    color: "#64748b"
  }
};
