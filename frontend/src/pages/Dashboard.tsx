import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import client from '../api/client';
import { Card } from '../components/ui/Card';
import { RetailerInventoryItem, Log } from '../types';

const Dashboard = () => {
    const [stats, setStats] = useState({ count: 0, value: 0, lowStock: 0 });
    const [recentLogs, setRecentLogs] = useState<Log[]>([]);
    
    useEffect(() => {
        const loadData = async () => {
             const [prodRes, logRes] = await Promise.all([
                 client.get<RetailerInventoryItem[]>('/api/inventory'),
                 client.get<Log[]>('/logs')
             ]);
             
             const products = prodRes.data;
             const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
             const lowStock = products.filter(p => p.quantity < 10).length;
             
             setStats({ count: products.length, value: totalValue, lowStock });
             setRecentLogs(logRes.data.slice(0, 5));
        };
        loadData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Products" value={stats.count} icon={<Package size={24}/>} color="bg-blue-500" />
                <StatCard title="Total Value" value={`$${stats.value.toLocaleString()}`} icon={<DollarSign size={24}/>} color="bg-emerald-500" />
                <StatCard title="Low Stock" value={stats.lowStock} icon={<AlertTriangle size={24}/>} color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Activity className="text-blue-500"/> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentLogs.map(log => (
                            <div key={log.id} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                                <div>
                                    <p className="font-medium">{log.products?.name || 'Unknown Item'}</p>
                                    <p className="text-xs text-slate-500 capitalize">{log.action} • {new Date(log.timestamp).toLocaleDateString()}</p>
                                </div>
                                <span className={log.action === 'add' ? 'text-emerald-400' : 'text-red-400'}>
                                    {log.action === 'add' ? '+' : '-'}{log.quantity}
                                </span>
                            </div>
                        ))}
                        {recentLogs.length === 0 && <p className="text-slate-500 text-sm">No activity recorded.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }: any) => (
    <Card className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-500`}>
             <div className={`text-white p-2 rounded-lg ${color}`}>{icon}</div>
        </div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </Card>
);

export default Dashboard;
