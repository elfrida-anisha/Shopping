import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../api/orderApi';

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [tokenInput, setTokenInput] = useState('');
    const [view, setView] = useState('orders'); 
    
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    useEffect(() => { 
        if(view === 'orders') loadOrders(); 
    }, [view]);
    
    const loadOrders = async () => { 
        const data = await getOrders(); 
        setOrders(data); 
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
            setView('orders');
        } else {
            alert(data.message);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '10px'}}>
                <h1>Cafe Admin</h1>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => setView('orders')}>Orders</button>
                    <button onClick={() => setView('settings')}>Settings</button>
                    <button onClick={handleLogout} style={{background: '#ff4d4d', color: 'white'}}>Logout</button>
                </div>
            </div>

            {view === 'orders' ? (
                <div style={{marginTop: '20px'}}>
                    <div style={{background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '8px'}}>
                        <h4>Verify Pickup</h4>
                        <input 
                            placeholder="Enter Student Token" 
                            value={tokenInput} 
                            onChange={(e) => setTokenInput(e.target.value)} 
                        />
                        <button onClick={verifyToken} style={{marginLeft: '10px', background: '#28a745', color: 'white'}}>Verify</button>
                    </div>

                    <h3>Active Orders</h3>
                    {orders.filter(o => o.status !== 'collected').map(o => (
                        <div key={o._id} style={{border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <strong>{o.studentName} (ID: {o.studentId})</strong>
                                <span>Token: <b style={{color: 'blue'}}>{o.token}</b></span>
                            </div>
                            <p>{o.items.map(i => i.name).join(', ')}</p>
                            <button onClick={() => updateOrderStatus(o._id, 'preparing').then(loadOrders)}>Set Preparing</button>
                            <button onClick={() => updateOrderStatus(o._id, 'ready').then(loadOrders)} style={{background: 'orange', marginLeft: '5px'}}>Set Ready</button>
                        </div>
                    ))}

                    {/* RESTORED HISTORY SECTION */}
                    <h3 style={{marginTop: '40px', color: '#666'}}>Completed History</h3>
                    <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                        {orders.filter(o => o.status === 'collected').map(o => (
                            <div key={o._id} style={{color: 'gray', padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
                                <span>{o.studentName} - {o.items.map(i => i.name).join(', ')}</span>
                                <b>{o.token} (Collected)</b>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{marginTop: '20px', maxWidth: '400px'}}>
                    <h3>Account Settings</h3>
                    <p>Logged in as: <b>{adminUser}</b></p>
                    <form onSubmit={handleChangePassword} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <input type="password" placeholder="Current Password" value={oldPass} onChange={e => setOldPass(e.target.value)} required />
                        <input type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} required />
                        <button type="submit" style={{background: '#333', color: 'white', padding: '10px'}}>Update Password</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
