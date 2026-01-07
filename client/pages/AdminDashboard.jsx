import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../api/orderApi';

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [tokenInput, setTokenInput] = useState('');
    const [view, setView] = useState('orders');
    
    // New Item State
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [imageFile, setImageFile] = useState(null); // New state for image

    // Password Change State
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    useEffect(() => { 
        loadOrders();
        fetchMenu();
        const interval = setInterval(loadOrders, 5000);
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

    const handleAddItem = async (e) => {
        e.preventDefault();
        
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('name', newItemName);
        formData.append('price', newItemPrice);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                // IMPORTANT: Don't set Content-Type header when sending FormData
                body: formData
            });

            if (res.ok) {
                setNewItemName('');
                setNewItemPrice('');
                setImageFile(null);
                e.target.reset(); // Reset file input UI
                fetchMenu();
            }
            console.log("was it was here!");
        } catch (err) {
            alert("Error adding item");
        }
    };

    const deleteItem = async (id) => {
        if(window.confirm("Delete this item?")) {
            await fetch(`http://localhost:5000/api/items/${id}`, { method: 'DELETE' });
            fetchMenu();
        }
    };

    // ... handleLogout and handleChangePassword remain the same as your code ...
    const handleLogout = () => { localStorage.clear(); navigate('/admin-login'); };
    const verifyToken = async () => { /* ... existing verifyToken code ... */ };
    const handleChangePassword = async (e) => { /* ... existing changePassword code ... */ };

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
                    {/* ... Orders View Remains Same ... */}
                    <div style={{background: '#e8f5e9', padding: '20px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #c8e6c9'}}>
                        <h3 style={{marginTop: 0}}>Token Verification</h3>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <input placeholder="Enter 4-digit Token" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} style={{padding: '12px', fontSize: '18px', width: '250px', borderRadius: '5px', border: '1px solid #ccc'}} />
                            <button onClick={verifyToken} style={{padding: '10px 25px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'}}>VERIFY</button>
                        </div>
                    </div>
                    {/* ... (Rest of Orders grid) ... */}
                </div>
            ) : (
                <div style={{marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px'}}>
                    <div>
                        <h3>Manage Menu Items</h3>
                        <form onSubmit={handleAddItem} style={{background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                            <input placeholder="Item Name" value={newItemName} onChange={e => setNewItemName(e.target.value)} required style={inputStyle} />
                            <input type="number" placeholder="Price" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} required style={inputStyle} />
                            <label style={{fontSize: '12px', color: '#666'}}>Product Image:</label>
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={inputStyle} />
                            <button type="submit" style={{width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px'}}>Add to Menu</button>
                        </form>
                        
                        <div style={{background: '#fff', border: '1px solid #ddd', borderRadius: '8px'}}>
                            {menuItems.map(item => (
                                <div key={item._id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <img src={item.imageUrl || 'https://via.placeholder.com/40'} alt="" style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}} />
                                        <span>{item.name} - ${item.price}</span>
                                    </div>
                                    <button onClick={() => deleteItem(item._id)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* ... Security Settings Remains Same ... */}
                </div>
            )}
        </div>
    );
}

// ... navBtnStyle, inputStyle, orderCardStyle functions remain same ...
const navBtnStyle = (active) => ({ padding: '8px 15px', background: active ? '#333' : '#eee', color: active ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' });
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
const orderCardStyle = (status) => ({ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px', background: status === 'ready' ? '#fff9c4' : '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' });

export default AdminDashboard;