import React, { useState, useEffect } from 'react';
import { placeOrder, getOrders } from '../api/orderApi';

function StudentHome() {
  const [name, setName] = useState(localStorage.getItem('studentName') || '');
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('studentId'));
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
      const interval = setInterval(fetchHistory, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchHistory = async () => {
    const allOrders = await getOrders();
    setHistory(allOrders.filter(o => o.studentId === studentId));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('studentName', name);
    localStorage.setItem('studentId', studentId);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  /* ---------- CART ---------- */

  const addToCart = (item) => {
    const exists = cart.find(i => i.name === item.name);
    if (exists) {
      setCart(cart.map(i =>
        i.name === item.name ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const changeQty = (name, delta) => {
    setCart(cart
      .map(i =>
        i.name === name ? { ...i, qty: i.qty + delta } : i
      )
      .filter(i => i.qty > 0)
    );
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleCheckout = async () => {
    setIsPaying(true);
    setTimeout(async () => {
      await placeOrder({
        studentId,
        studentName: name,
        items: cart,
        totalPrice: total
      });
      setCart([]);
      setIsPaying(false);
      fetchHistory();
    }, 1200);
  };

  const menuItems = [
    { name: 'Tea', price: 10, img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348' },
    { name: 'Coffee', price: 20, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93' },
    { name: 'Samosa', price: 15, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950' },
    { name: 'Burger', price: 40, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349' }
  ];

  /* ---------- LOGIN ---------- */

  if (!isLoggedIn) {
    return (
      <div style={loginWrap}>
        <form style={loginCard} onSubmit={handleLogin}>
          <h2 style={{ marginBottom: 6 }}>☕ Campus Café</h2>
          <p style={{ opacity: 0.7, marginBottom: 18 }}>Smart Ordering System</p>

          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={input}
            required
          />

          <input
            placeholder="Student ID"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            style={input}
            required
          />

          <button style={primaryBtn}>Enter Café</button>
        </form>
      </div>
    );
  }

  /* ---------- PAYMENT ---------- */

  if (isPaying) {
    return (
      <div style={center}>
        <h2>Processing Payment ☕</h2>
        <p>Please wait a moment...</p>
      </div>
    );
  }

  /* ---------- MAIN ---------- */

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: 12, opacity: 0.7 }}>ID: {studentId}</div>
        </div>
        <button style={logoutBtn} onClick={handleLogout}>Logout</button>
      </header>

      <h3 style={title}>Menu</h3>

      <div style={menuGrid}>
        {menuItems.map(item => (
          <div
            key={item.name}
            style={menuCard}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img src={item.img} alt={item.name} style={menuImg} />
            <div style={menuBody}>
              <strong>{item.name}</strong>
              <span style={{ opacity: 0.7 }}>₹ {item.price}</span>
              <button style={addBtn} onClick={() => addToCart(item)}>Add</button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={checkoutCard}>
          <h3>Order Summary</h3>

          {cart.map(i => (
            <div key={i.name} style={cartRow}>
              <span>{i.name}</span>

              <div style={qtyPill}>
                <button style={qtyBtn} onClick={() => changeQty(i.name, -1)}>-</button>
                <span>{i.qty}</span>
                <button style={qtyBtn} onClick={() => changeQty(i.name, 1)}>+</button>
              </div>

              <span>₹ {i.price * i.qty}</span>
            </div>
          ))}

          <div style={totalRow}>
            <strong>Total</strong>
            <strong>₹ {total}</strong>
          </div>

          <button style={payBtn} onClick={handleCheckout}>
            Pay & Place Order
          </button>
        </div>
      )}

      <h3 style={title}>Order History</h3>
      {history.map(o => (
        <div key={o._id} style={historyCard}>
          <strong>{o.status.toUpperCase()}</strong> — Token #{o.token}
          <div style={{ opacity: 0.7 }}>
            {o.items.map(i => `${i.name} x${i.qty}`).join(', ')}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: '100vh',
  padding: 24,
  background: 'linear-gradient(135deg,#eef2ff,#fdf2f8)',
  fontFamily: '"Inter", system-ui'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 22px',
  borderRadius: 18,
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
  marginBottom: 32
};

const title = {
  margin: '36px 0 16px',
  fontSize: 20,
  fontWeight: 700
};

const menuGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
  gap: 20
};

const menuCard = {
  background: 'rgba(255,255,255,0.8)',
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  transition: 'all .25s ease'
};

const menuImg = { width: '100%', height: 140, objectFit: 'cover' };

const menuBody = {
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 6
};

const addBtn = {
  marginTop: 10,
  padding: '10px 14px',
  borderRadius: 999,
  border: 'none',
  background: 'linear-gradient(90deg,#22c55e,#16a34a)',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer'
};

const checkoutCard = {
  marginTop: 40,
  padding: 24,
  borderRadius: 22,
  background: 'linear-gradient(135deg,#eef2ff,#ffffff)',
  boxShadow: '0 25px 50px rgba(79,70,229,0.25)'
};

const cartRow = {
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  gap: 14,
  alignItems: 'center',
  padding: '10px 0'
};

const qtyPill = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: '#fff',
  borderRadius: 999,
  padding: '6px 12px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
};

const qtyBtn = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: 'none',
  background: '#4f46e5',
  color: '#fff',
  cursor: 'pointer',

  /* ⭐ FIX FOR CENTERING */
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: '1',
  padding: 0,
  fontSize: 16
};


const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 16,
  paddingTop: 10,
  borderTop: '1px solid #e5e7eb'
};

const payBtn = {
  marginTop: 22,
  width: '100%',
  padding: 14,
  borderRadius: 999,
  background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
  color: '#fff',
  border: 'none',
  fontSize: 17,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 12px 30px rgba(99,102,241,0.45)'
};

const historyCard = {
  background: 'rgba(255,255,255,0.8)',
  padding: 16,
  marginTop: 14,
  borderRadius: 16,
  boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
};

const logoutBtn = {
  padding: '6px 12px',
  borderRadius: 8,
  border: 'none',
  background: '#ef4444',
  color: '#fff',
  cursor: 'pointer'
};

const loginWrap = {
  height: '100vh',
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const loginCard = {
  background: '#fff',
  padding: 36,
  width: 340,
  borderRadius: 22,
  textAlign: 'center',
  boxShadow: '0 30px 60px rgba(0,0,0,0.35)'
};

const input = {
  width: '100%',
  padding: 12,
  marginTop: 12,
  borderRadius: 10,
  border: '1px solid #d1d5db'
};

const primaryBtn = {
  marginTop: 18,
  width: '100%',
  padding: 12,
  borderRadius: 999,
  border: 'none',
  background: '#4f46e5',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer'
};

const center = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

export default StudentHome;
