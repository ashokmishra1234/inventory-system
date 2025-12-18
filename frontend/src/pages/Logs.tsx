import { useEffect, useState } from 'react';
import client from '../api/client';
import { Card } from '../components/ui/Card';
import { Log } from '../types';

const Logs = () => {
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        client.get('/logs').then(res => setLogs(res.data));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left bg-slate-800">
                    <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 text-sm">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Product</th>
                            <th className="p-4">Change</th>
                            <th className="p-4">Source</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-700/30">
                                <td className="p-4 text-slate-400 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="p-4 capitalize">{log.action}</td>
                                <td className="p-4 font-medium text-white">
                                    {log.products?.name} <span className="text-slate-500 font-normal text-xs ml-1">({log.products?.sku})</span>
                                </td>
                                <td className="p-4 font-mono">{log.quantity}</td>
                                <td className="p-4 text-slate-500 text-sm">{log.source}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Logs;
