import React from "react";
import menu from "../data/menu";
import orders from "../data/order";

function AdminDashboard() {
  return (
    <div style={styles.wrapper}>
      {/* ========== SIDEBAR ========== */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Cafeteria Admin</h2>
        <p style={styles.menuItem}>Dashboard</p>
        <p style={styles.menuItem}>Products</p>
        <p style={styles.menuItem}>Orders</p>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div style={styles.main}>
        <h1 style={styles.heading}>Dashboard Overview</h1>

        {/* ========== SUMMARY CARDS ========== */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <h3>Total Products</h3>
            <p style={styles.summaryNumber}>{menu.length}</p>
          </div>

          <div style={styles.summaryCard}>
            <h3>Total Orders</h3>
            <p style={styles.summaryNumber}>{orders.length}</p>
          </div>

          <div style={styles.summaryCard}>
            <h3>Active Tokens</h3>
            <p style={styles.summaryNumber}>{orders.length}</p>
          </div>
        </div>

        {/* ========== ORDERS TABLE ========== */}
        <h2 style={styles.sectionTitle}>Live Orders</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Token</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.token}>{order.token}</td>

                <td>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} × {item.qty}
                    </div>
                  ))}
                </td>

                <td>₹{order.total}</td>

                <td>
                  <span style={styles.preparing}>Preparing</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
    background: "#f8fafc"
  },

  sidebar: {
    width: "230px",
    background: "linear-gradient(180deg, #0f172a, #1e293b)",
    color: "#ffffff",
    padding: "24px",
    boxShadow: "4px 0 18px rgba(0,0,0,0.15)"
  },

  logo: {
    marginBottom: "40px",
    fontSize: "22px",
    fontWeight: "600",
    letterSpacing: "0.5px"
  },

  menuItem: {
    marginBottom: "18px",
    cursor: "pointer",
    color: "#cbd5f5",
    fontSize: "15px"
  },

  main: {
    flex: 1,
    padding: "32px"
  },

  heading: {
    color: "#0f172a",
    marginBottom: "10px"
  },

  sectionTitle: {
    marginTop: "45px",
    marginBottom: "16px",
    color: "#1e293b",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "6px"
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  },

  summaryCard: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },

  summaryNumber: {
    fontSize: "30px",
    fontWeight: "600",
    color: "#2563eb",
    marginTop: "8px"
  },

  table: {
    width: "100%",
    background: "#ffffff",
    borderCollapse: "collapse",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },

  th: {
    padding: "14px",
    textAlign: "left",
    background: "#f1f5f9",
    color: "#334155"
  },

  tr: {
    borderBottom: "1px solid #e5e7eb"
  },

  token: {
    padding: "14px",
    fontWeight: "600",
    color: "#1d4ed8"
  },

  preparing: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: "500"
  }
};
