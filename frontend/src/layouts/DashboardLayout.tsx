import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ClipboardList, LogOut, Menu, X, Link as LinkIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 fixed top-0 w-full z-40">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white mr-3">I</div>
                    <span className="font-bold text-xl">InvSystem</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 flex flex-col bg-slate-900 p-4 transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-12 flex items-center px-2 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white mr-3">I</div>
                    <span className="font-bold text-xl">InvSystem</span>
                </div>
                
                <nav className="space-y-1 flex-1">
                    <NavItem 
                        to="/" 
                        icon={<LayoutDashboard size={20}/>} 
                        label="Dashboard" 
                        active={location.pathname === '/'} 
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <NavItem 
                        to="/inventory" 
                        icon={<Package size={20}/>} 
                        label="My Inventory" 
                        active={location.pathname === '/inventory'} 
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <NavItem 
                        to="/billing" 
                        icon={<ClipboardList size={20}/>}
                        label="Billing / POS" 
                        active={location.pathname === '/billing'} 
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <NavItem 
                        to="/blockchain" 
                        icon={<LinkIcon size={20}/>}
                        label="Blockchain Audit" 
                        active={location.pathname === '/blockchain'} 
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    {user?.role === 'admin' && (
                        <NavItem 
                            to="/logs" 
                            icon={<ClipboardList size={20}/>} 
                            label="Audit Logs" 
                            active={location.pathname === '/logs'} 
                            onClick={() => setIsSidebarOpen(false)}
                        />
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

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 pt-20 md:p-8 md:pt-8 w-full">
                <Outlet />
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, active, onClick }: any) => (
    <Link 
        to={to} 
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            active ? "bg-blue-600/10 text-blue-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        )}
    >
        {icon}
        {label}
    </Link>
);
