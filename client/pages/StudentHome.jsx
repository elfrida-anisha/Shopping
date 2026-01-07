import React, { useState, useEffect } from 'react';
import { placeOrder, getOrders } from '../api/orderApi';

function StudentHome() {
    // ... all existing states (name, studentId, cart, menuItems, etc.) ...
    const [name, setName] = useState(localStorage.getItem('studentName') || '');
    const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('studentId'));
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([]);
    const [menuItems, setMenuItems] = useState([]); 
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            fetchMenu();
            const interval = setInterval(fetchHistory, 5000);
            fetchHistory();
            return () => clearInterval(interval);
        }
    }, [isLoggedIn]);

    const fetchMenu = async () => {
        const res = await fetch('http://localhost:5000/api/items');
        const data = await res.json();
        setMenuItems(data);
    };

    const fetchHistory = async () => {
        const allOrders = await getOrders();
        setHistory(allOrders.filter(o => o.studentId === studentId));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (name && studentId) {
            localStorage.setItem('studentName', name);
            localStorage.setItem('studentId', studentId);
            setIsLoggedIn(true);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsPaying(true);
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        try {
            await placeOrder({ studentId, studentName: name, items: cart, totalPrice: total });
            setCart([]);
            setIsPaying(false);
            fetchHistory();
        } catch (err) {
            alert("Order failed!");
            setIsPaying(false);
        }
    };

    if (!isLoggedIn) { /* ... keep your existing login UI ... */ return <div style={{padding:'40px',textAlign:'center'}}><h2>College Cafe Login</h2><form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'10px',maxWidth:'300px',margin:'auto'}}><input style={{padding:'10px'}} placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required/><input style={{padding:'10px'}} placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} required/><button type="submit" style={{padding:'10px',background:'#007bff',color:'white',border:'none',borderRadius:'5px',cursor:'pointer'}}>Start Ordering</button></form></div>; }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Hi, {name}</h3>
                    <small style={{ color: '#666' }}>ID: {studentId}</small>
                </div>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </header>
            
            <div style={{ margin: '20px 0' }}>
                <h4>Today's Menu</h4>
                {/* Visual Menu Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {menuItems.map(item => (
                        <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
                            <img 
                                src={item.imageUrl || 'https://via.placeholder.com/150'} 
                                alt={item.name} 
                                style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                            />
                            <div style={{ padding: '10px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.name}</div>
                                <div style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '10px' }}>${item.price}</div>
                                <button 
                                    onClick={() => setCart([...cart, { name: item.name, price: item.price }])}
                                    style={{ width: '100%', padding: '8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary Section */}
                {cart.length > 0 && (
                    <div style={{ background: '#e3f2fd', padding: '15px', marginTop: '20px', borderRadius: '8px', border: '1px solid #bbdefb' }}>
                        <p><strong>Cart:</strong> {cart.map(i => i.name).join(', ')}</p>
                        <p><strong>Total: ${cart.reduce((s, i) => s + i.price, 0)}</strong></p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleCheckout} style={{ background: '#28a745', color: 'white', border: 'none', padding: '12px', flex: 2, borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Pay & Get Token</button>
                            <button onClick={() => setCart([])} style={{ background: '#f44336', color: 'white', border: 'none', padding: '12px', flex: 1, borderRadius: '5px', cursor: 'pointer' }}>Clear</button>
                        </div>
                    </div>
                )}
            </div>

            <h4>Order History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map(order => (
                    <div key={order._id} style={{ padding: '12px', background: order.status === 'collected' ? '#f9f9f9' : '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold', color: order.status === 'ready' ? '#28a745' : '#ffa000' }}>{order.status.toUpperCase()}</span>
                            <span style={{ color: '#007bff', fontWeight: 'bold' }}>Token: {order.token}</span>
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '5px' }}>{order.items.map(i => i.name).join(', ')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentHome;