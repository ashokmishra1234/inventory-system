
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';
// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PrivateInventory from './pages/PrivateInventory';
import Logs from './pages/Logs';

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
            position="top-right" 
            toastOptions={{
                style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
            }}
        />
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
             <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<PrivateInventory />} />
                <Route path="/logs" element={<Logs />} />
             </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
