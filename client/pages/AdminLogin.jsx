import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('adminUser', user); // Store username for password change
            navigate('/admin');
        } else {
            alert(data.message);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Cafe Staff Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
                <input placeholder="Username" onChange={e => setUser(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} required />
                <button type="submit" style={{ background: '#333', color: '#fff', padding: '10px' }}>Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;
