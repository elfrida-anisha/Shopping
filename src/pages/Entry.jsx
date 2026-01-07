import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Entry() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/menu");
    }, 2000);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>College Cafeteria</h1>
      <p style={styles.subtitle}>Smart Food Pre-Order System</p>
      <div style={styles.loader}></div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff"
  },
  title: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "10px"
  },
  subtitle: {
    fontSize: "1.2rem",
    opacity: 0.9,
    marginBottom: "30px"
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

export default Entry;
