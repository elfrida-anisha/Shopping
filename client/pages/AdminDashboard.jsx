import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../api/orderApi';

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [tokenInput, setTokenInput] = useState('');
    const [view, setView] = useState('orders'); // 'orders' or 'settings'
    
    // New Item State
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');

    // Password Change State
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    useEffect(() => { 
        loadOrders();
        fetchMenu();
        const interval = setInterval(loadOrders, 5000); // Auto-refresh orders
        return () => clearInterval(interval);
    }, []);
    
    const loadOrders = async () => { 
        const data = await getOrders(); 
        setOrders(data); 
    };

    const fetchMenu = async () => {
        const res = await fetch('http://localhost:5000/api/items');
        const data = await res.json();
        setMenuItems(data);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/admin-login');
    };

    const verifyToken = async () => {
        const res = await fetch('http://localhost:5000/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: tokenInput })
        });
        if (res.ok) {
            alert("Order Verified & Collected!");
            setTokenInput('');
            loadOrders();
        } else {
            alert("Invalid Token or Order not ready!");
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5000/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newItemName, price: Number(newItemPrice) })
        });
        setNewItemName('');
        setNewItemPrice('');
        fetchMenu();
    };

    const deleteItem = async (id) => {
        if(window.confirm("Delete this item?")) {
            await fetch(`http://localhost:5000/api/items/${id}`, { method: 'DELETE' });
            fetchMenu();
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/admin/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: adminUser, 
                oldPassword: oldPass, 
                newPassword: newPass 
            })
        });
        const data = await res.json();
        if (data.success) {
            alert("Password updated successfully!");
            setOldPass('');
            setNewPass('');
        } else {
            alert(data.message);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial' }}>
            {/* Top Navigation Bar */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '10px'}}>
                <h1 style={{margin: 0, color: '#333'}}>Cafe Dashboard</h1>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => setView('orders')} style={navBtnStyle(view === 'orders')}>Live Orders</button>
                    <button onClick={() => setView('settings')} style={navBtnStyle(view === 'settings')}>Manage Menu & Account</button>
                    <button onClick={handleLogout} style={{background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'}}>Logout</button>
                </div>
            </div>

            {view === 'orders' ? (
                <div style={{marginTop: '20px'}}>
                    {/* Verification Tool */}
                    <div style={{background: '#e8f5e9', padding: '20px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #c8e6c9'}}>
                        <h3 style={{marginTop: 0}}>Token Verification (Customer Pickup)</h3>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <input 
                                placeholder="Enter 4-digit Token" 
                                value={tokenInput} 
                                onChange={(e) => setTokenInput(e.target.value)} 
                                style={{padding: '12px', fontSize: '18px', width: '250px', borderRadius: '5px', border: '1px solid #ccc'}}
                            />
                            <button onClick={verifyToken} style={{padding: '10px 25px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'}}>VERIFY & COMPLETE</button>
                        </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        {/* Active Orders Column */}
                        <div>
                            <h3 style={{borderBottom: '2px solid #007bff', paddingBottom: '5px'}}>Active Orders</h3>
                            {orders.filter(o => o.status !== 'collected').length === 0 ? <p>No active orders.</p> : 
                             orders.filter(o => o.status !== 'collected').map(o => (
                                <div key={o._id} style={orderCardStyle(o.status)}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <strong>{o.studentName}</strong>
                                        <span style={{color: '#007bff'}}>Token: <b>{o.token}</b></span>
                                    </div>
                                    <p style={{margin: '10px 0'}}>{o.items.map(i => i.name).join(', ')}</p>
                                    <div style={{display: 'flex', gap: '5px'}}>
                                        <button onClick={() => updateOrderStatus(o._id, 'preparing').then(loadOrders)}>Preparing</button>
                                        <button onClick={() => updateOrderStatus(o._id, 'ready').then(loadOrders)} style={{background: 'orange'}}>Ready</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* History Column */}
                        <div>
                            <h3 style={{borderBottom: '2px solid #666', paddingBottom: '5px'}}>Recently Collected</h3>
                            <div style={{maxHeight: '500px', overflowY: 'auto'}}>
                                {orders.filter(o => o.status === 'collected').map(o => (
                                    <div key={o._id} style={{padding: '10px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#666'}}>
                                        <b>{o.studentName}</b> collected {o.items.length} items (Token: {o.token})
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px'}}>
                    {/* Menu Management */}
                    <div>
                        <h3>Manage Menu Items</h3>
                        <form onSubmit={handleAddItem} style={{background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                            <input placeholder="Item Name (e.g. Samosa)" value={newItemName} onChange={e => setNewItemName(e.target.value)} required style={inputStyle} /><br/>
                            <input type="number" placeholder="Price" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} required style={inputStyle} /><br/>
                            <button type="submit" style={{width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px'}}>Add to Menu</button>
                        </form>
                        
                        <div style={{background: '#fff', border: '1px solid #ddd', borderRadius: '8px'}}>
                            {menuItems.map(item => (
                                <div key={item._id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee'}}>
                                    <span>{item.name} - ${item.price}</span>
                                    <button onClick={() => deleteItem(item._id)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div>
                        <h3>Admin Security</h3>
                        <div style={{background: '#fff3e0', padding: '20px', borderRadius: '8px', border: '1px solid #ffe0b2'}}>
                            <p>Update Password for: <b>{adminUser}</b></p>
                            <form onSubmit={handleChangePassword} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <input type="password" placeholder="Current Password" value={oldPass} onChange={e => setOldPass(e.target.value)} required style={inputStyle} />
                                <input type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} required style={inputStyle} />
                                <button type="submit" style={{padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '5px'}}>Update Securely</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Styling Helper Functions
const navBtnStyle = (active) => ({
    padding: '8px 15px',
    background: active ? '#333' : '#eee',
    color: active ? 'white' : '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
});

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

const orderCardStyle = (status) => ({
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px',
    background: status === 'ready' ? '#fff9c4' : '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

export default AdminDashboard;
