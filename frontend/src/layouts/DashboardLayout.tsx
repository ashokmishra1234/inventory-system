import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ClipboardList, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';

export const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
            <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900 p-4">
                <div className="h-12 flex items-center px-2 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white mr-3">I</div>
                    <span className="font-bold text-xl">InvSystem</span>
                </div>
                
                <nav className="space-y-1 flex-1">
                    <NavItem to="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={location.pathname === '/'} />
                    <NavItem to="/products" icon={<Package size={20}/>} label="Products" active={location.pathname === '/products'} />
                    {user?.role === 'admin' && (
                        <NavItem to="/logs" icon={<ClipboardList size={20}/>} label="Audit Logs" active={location.pathname === '/logs'} />
                    )}
                </nav>

                <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                            {user?.name?.[0]}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="flex items-center gap-3 px-2 py-2 text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors text-sm">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, active }: any) => (
    <Link to={to} className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        active ? "bg-blue-600/10 text-blue-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
    )}>
        {icon}
        {label}
    </Link>
);
