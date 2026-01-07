import React, { useState, useEffect } from 'react';
import { placeOrder, getOrders } from '../api/orderApi';

function StudentHome() {
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
        try {
            const res = await fetch('http://localhost:5000/api/items');
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setMenuItems(data);
        } catch (err) {
            console.error("Failed to fetch menu items:", err);
        }
    };

    const fetchHistory = async () => {
        try {
            const allOrders = await getOrders();
            setHistory(allOrders.filter(o => o.studentId === studentId));
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (name && studentId) {
            localStorage.setItem('studentName', name);
            localStorage.setItem('studentId', studentId);
            setIsLoggedIn(true);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsPaying(true);
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        try {
            await placeOrder({ 
                studentId, 
                studentName: name, 
                items: cart, 
                totalPrice: total 
            });
            setCart([]);
            setIsPaying(false);
            fetchHistory();
        } catch (err) {
            alert("Order failed!");
            setIsPaying(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
                <h2>College Cafe Login</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
                    <input style={{padding: '10px'}} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                    <input style={{padding: '10px'}} placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} required />
                    <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Start Ordering</button>
                </form>
            </div>
        );
    }

    if (isPaying) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
                <h2>Processing Payment... 💸</h2>
                <p>Please do not refresh the page.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Hi, {name}</h3>
                    <small style={{ color: '#666' }}>ID: {studentId}</small>
                </div>
                <button onClick={handleLogout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </header>
            
            <div style={{ margin: '20px 0', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <h4>Today's Menu</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {menuItems.length === 0 ? (
                        <p style={{ color: '#888', fontSize: '14px' }}>No items available yet.</p>
                    ) : (
                        menuItems.map(item => (
                            <button 
                                key={item._id} 
                                onClick={() => setCart([...cart, { name: item.name, price: item.price }])}
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    borderRadius: '5px', 
                                    border: '1px solid #007bff', 
                                    background: '#fff', 
                                    color: '#007bff',
                                    fontWeight: '500' 
                                }}
                            >
                                Add {item.name} (${item.price})
                            </button>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ background: '#e3f2fd', padding: '15px', marginTop: '15px', borderRadius: '5px' }}>
                        <p style={{ margin: '0 0 10px 0' }}><strong>Items:</strong> {cart.map(i => i.name).join(', ')}</p>
                        <p><strong>Cart Total: ${cart.reduce((s, i) => s + i.price, 0)}</strong></p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleCheckout} style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px', flex: 2, borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Pay & Get Token
                            </button>
                            <button onClick={() => setCart([])} style={{ background: '#f44336', color: 'white', border: 'none', padding: '10px', flex: 1, borderRadius: '5px', cursor: 'pointer' }}>
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <h4>My Order History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.length === 0 ? <p>No orders yet.</p> : history.map(order => (
                    <div key={order._id} style={{ 
                        padding: '12px', 
                        background: order.status === 'collected' ? '#f0f0f0' : '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span style={{ 
                                color: order.status === 'ready' ? '#28a745' : (order.status === 'preparing' ? '#ffa000' : '#333') 
                            }}>
                                {order.status.toUpperCase()}
                            </span>
                            <span style={{ color: '#007bff' }}>Token: {order.token}</span>
                        </div>
                        <div style={{ marginTop: '5px', fontSize: '14px' }}>
                            {order.items.map(i => i.name).join(', ')}
                        </div>
                        <small style={{ color: '#888' }}>{new Date(order.createdAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentHome;
