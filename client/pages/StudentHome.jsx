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
    try {
      const allOrders = await getOrders();
      setHistory(allOrders.filter(o => o.studentId === studentId).reverse());
    } catch (err) {
      console.error("Failed to fetch orders");
    }
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

  const addToCart = (item) => {
    const exists = cart.find(i => i.name === item.name);
    if (exists) {
      setCart(cart.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const changeQty = (name, delta) => {
    setCart(cart.map(i => i.name === name ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleCheckout = async () => {
    setIsPaying(true);
    setTimeout(async () => {
      await placeOrder({ studentId, studentName: name, items: cart, totalPrice: total });
      setCart([]);
      setIsPaying(false);
      fetchHistory();
    }, 1500);
  };

  const menuItems = [
    { name: 'Masala Tea', price: 10, img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=300' },
    { name: 'Cold Coffee', price: 20, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300' },
    { name: 'Veg Samosa', price: 15, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300' },
    { name: 'Cheese Burger', price: 40, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300' }
  ];

  if (!isLoggedIn) {
    return (
      <div style={loginWrap}>
        <div style={loginCard}>
          <div style={logoIcon}>☕</div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1e1b4b' }}>Campus Cafe</h2>
          <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>Enter your details to start ordering</p>
          <form onSubmit={handleLogin}>
            <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={input} required />
            <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} style={input} required />
            <button style={primaryBtn}>Get Started</button>
          </form>
        </div>
      </div>
    );
  }

  if (isPaying) {
    return (
      <div style={center}>
        <div className="spinner" style={loader}></div>
        <h2 style={{ marginTop: 20, color: '#4338ca' }}>Securing your order...</h2>
        <p style={{ color: '#64748b' }}>We're processing your payment</p>
      </div>
    );
  }

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <div style={{ fontSize: 14, color: '#6366f1', fontWeight: 600 }}>Welcome back,</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b' }}>{name} <span style={{ fontWeight: 400, fontSize: 14, color: '#94a3b8' }}>({studentId})</span></div>
        </div>
        <button style={logoutBtn} onClick={handleLogout}>Logout</button>
      </header>

      <div style={mainLayout}>
        <section style={{ flex: 2 }}>
          <h3 style={sectionTitle}>Explore Menu</h3>
          <div style={menuGrid}>
            {menuItems.map(item => (
              <div key={item.name} style={menuCard}>
                <img src={item.img} alt={item.name} style={menuImg} />
                <div style={menuBody}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 16 }}>{item.name}</strong>
                    <span style={priceTag}>₹{item.price}</span>
                  </div>
                  <button style={addBtn} onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>

          <h3 style={sectionTitle}>Order History</h3>
          <div style={historyList}>
            {history.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>No orders yet.</p>}
            {history.map(o => (
              <div key={o._id} style={historyCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={statusBadge(o.status)}>{o.status.toUpperCase()}</span>
                  <span style={{ fontWeight: 700, color: '#6366f1' }}>#{o.token}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 14, color: '#475569' }}>
                  {o.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {cart.length > 0 && (
          <aside style={sidebar}>
            <div style={checkoutCard}>
              <h3 style={{ marginTop: 0, marginBottom: 20 }}>Your Order</h3>
              <div style={cartItemsContainer}>
                {cart.map(i => (
                  <div key={i.name} style={cartRow}>
                    <div style={{ fontWeight: 500 }}>{i.name}</div>
                    <div style={qtyPill}>
                      <button style={qtyBtn} onClick={() => changeQty(i.name, -1)}>-</button>
                      <span style={{ minWidth: 20, textAlign: 'center' }}>{i.qty}</span>
                      <button style={qtyBtn} onClick={() => changeQty(i.name, 1)}>+</button>
                    </div>
                    <div style={{ fontWeight: 600 }}>₹{i.price * i.qty}</div>
                  </div>
                ))}
              </div>
              <div style={totalRow}>
                <span>Total Amount</span>
                <span style={{ fontSize: 22 }}>₹{total}</span>
              </div>
              <button style={payBtn} onClick={handleCheckout}>Place Order Now</button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ================= THEME & STYLES ================= */

const page = {
  minHeight: '100vh',
  padding: '20px 5vw',
  background: '#f8fafc',
  fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
  color: '#1e293b'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 30px',
  borderRadius: 24,
  background: '#ffffff',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  marginBottom: 40
};

const mainLayout = {
  display: 'flex',
  gap: 30,
  flexWrap: 'wrap'
};

const sectionTitle = {
  fontSize: 22,
  fontWeight: 800,
  marginBottom: 20,
  color: '#1e1b4b'
};

const menuGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 24,
  marginBottom: 40
};

const menuCard = {
  background: '#fff',
  borderRadius: 24,
  overflow: 'hidden',
  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
  transition: 'transform 0.2s ease',
  border: '1px solid #f1f5f9'
};

const menuImg = { width: '100%', height: 160, objectFit: 'cover' };

const menuBody = { padding: 20 };

const priceTag = {
  background: '#eef2ff',
  color: '#4338ca',
  padding: '4px 10px',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700
};

const addBtn = {
  marginTop: 16,
  width: '100%',
  padding: '12px',
  borderRadius: 12,
  border: 'none',
  background: '#1e1b4b',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.2s'
};

const sidebar = { flex: 1, minWidth: 320 };

const checkoutCard = {
  padding: 30,
  borderRadius: 28,
  background: '#fff',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  position: 'sticky',
  top: 20,
  border: '1px solid #e2e8f0'
};

const cartItemsContainer = {
  maxHeight: '40vh',
  overflowY: 'auto',
  marginBottom: 20
};

const cartRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #f1f5f9'
};

const qtyPill = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: '#f8fafc',
  borderRadius: 10,
  padding: '4px 8px'
};

const qtyBtn = {
  width: 24,
  height: 24,
  borderRadius: 6,
  border: 'none',
  background: '#fff',
  color: '#1e1b4b',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 20,
  padding: '20px 0',
  borderTop: '2px dashed #e2e8f0',
  fontWeight: 800
};

const payBtn = {
  width: '100%',
  padding: '16px',
  borderRadius: 16,
  background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
  color: '#fff',
  border: 'none',
  fontSize: 16,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
};

const historyList = { display: 'flex', flexDirection: 'column', gap: 12 };

const historyCard = {
  background: '#fff',
  padding: 20,
  borderRadius: 16,
  border: '1px solid #f1f5f9'
};

const statusBadge = (status) => ({
  fontSize: 11,
  fontWeight: 800,
  padding: '4px 12px',
  borderRadius: 20,
  background: status === 'ready' ? '#dcfce7' : status === 'pending' ? '#fef9c3' : '#f1f5f9',
  color: status === 'ready' ? '#166534' : status === 'pending' ? '#854d0e' : '#475569'
});

const loginWrap = {
  height: '100vh',
  background: '#6366f1',
  backgroundImage: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const loginCard = {
  background: '#fff',
  padding: '40px 30px',
  width: 380,
  borderRadius: 32,
  textAlign: 'center',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const logoIcon = {
  fontSize: 40,
  marginBottom: 10,
  display: 'inline-block',
  background: '#eef2ff',
  width: 80,
  height: 80,
  lineHeight: '80px',
  borderRadius: '50%'
};

const input = {
  width: '100%',
  padding: '14px 16px',
  marginBottom: 16,
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box'
};

const primaryBtn = {
  width: '100%',
  padding: 14,
  borderRadius: 12,
  border: 'none',
  background: '#4f46e5',
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer'
};

const logoutBtn = {
  padding: '8px 16px',
  borderRadius: 10,
  border: '1px solid #fee2e2',
  background: '#fff',
  color: '#ef4444',
  fontWeight: 600,
  cursor: 'pointer'
};

const center = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8fafc'
};

const loader = {
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #4338ca',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite'
};

export default StudentHome;