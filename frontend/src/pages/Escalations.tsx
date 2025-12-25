import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
// import supabase from '../config/supabase'; // Removed unused

type Escalation = {
  escalation_id: string;
  product_name: string;
  requested_discount: number;
  allowed_discount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
};

export default function Escalations() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEscalations();
  }, []);

  const fetchEscalations = async () => {
    try {
      // Using axios client which calls /api/escalations
      const { data } = await client.get('/api/escalations');
      setEscalations(data);
    } catch (error) {
      console.error("Failed to fetch escalations", error);
    } finally {
        setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'APPROVED': return 'text-green-600 bg-green-50 border-green-200';
          case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
          default: return 'text-orange-600 bg-orange-50 border-orange-200';
      }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
          case 'REJECTED': return <XCircle className="w-4 h-4" />;
          default: return <Clock className="w-4 h-4" />;
      }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discount Escalations</h1>
        <div className="flex gap-2">
             <button onClick={fetchEscalations} className="p-2 bg-white border rounded hover:bg-gray-50">
                Refresh
             </button>
        </div>
      </div>

      {loading ? (
          <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                        <th className="p-4 font-medium">Escalation ID</th>
                        <th className="p-4 font-medium">Product</th>
                        <th className="p-4 font-medium">Requested</th>
                        <th className="p-4 font-medium">Allowed</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {escalations.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                No escalation requests found.
                            </td>
                        </tr>
                    ) : (
                        escalations.map((esc) => (
                            <tr key={esc.escalation_id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-sm">{esc.escalation_id}</td>
                                <td className="p-4 font-medium text-gray-900">{esc.product_name}</td>
                                <td className="p-4 text-red-600 font-bold">{esc.requested_discount}%</td>
                                <td className="p-4 text-gray-500">{esc.allowed_discount}%</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(esc.status)}`}>
                                        {getStatusIcon(esc.status)}
                                        {esc.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(esc.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}
