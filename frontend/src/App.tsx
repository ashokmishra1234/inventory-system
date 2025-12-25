
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';
// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import PrivateInventory from './pages/PrivateInventory';
import Billing from './pages/Billing';
import Logs from './pages/Logs';
import BlockchainAudit from './pages/BlockchainAudit';
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import BlockchainInfo from './pages/BlockchainInfo';
import Pricing from './pages/Pricing';
import Escalations from './pages/Escalations';

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
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/blockchain-info" element={<BlockchainInfo />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected Routes (Dashboard) */}
          <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="inventory" element={<PrivateInventory />} />
                <Route path="billing" element={<Billing />} />
                <Route path="logs" element={<Logs />} />
                <Route path="logs" element={<Logs />} />
                <Route path="blockchain" element={<BlockchainAudit />} />
                <Route path="escalations" element={<Escalations />} />
             </Route>
          </Route>

          {/* Catch all - Redirect to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
