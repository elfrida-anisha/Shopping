import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import StudentHome from '../pages/StudentHome';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';

// Helper component to protect Admin Route
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#333', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{color: 'white', textDecoration: 'none'}}>Student Portal</Link>
        <Link to="/admin" style={{color: 'white', textDecoration: 'none'}}>Admin Panel</Link>
      </nav>

      <Routes>
        {/* Public Student Route */}
        <Route path="/" element={<StudentHome />} />

        {/* Admin Login Route */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
