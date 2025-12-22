import { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import client from '../api/client';


interface BlockchainStats {
  enabled: boolean;
  totalEvents: number;
  network: string;
  contractAddress: string;
}

const BlockchainAudit = () => {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlockchainStats();
  }, []);

  const fetchBlockchainStats = async () => {
    try {
      const response = await client.get('/blockchain/stats');
      setStats(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Blockchain fetch error:', err);
      // Debug info: show what URL was attempted
      const attemptedUrl = client.defaults.baseURL + '/blockchain/stats';
      const msg = `Failed to connect to ${attemptedUrl}. Details: ${err.message}`;
      setError(msg);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-white text-center py-12">Loading blockchain data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Error connecting to blockchain</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Blockchain Audit Trail</h1>
          <p className="text-slate-400">Immutable record of all inventory actions</p>
        </div>

        {/* Blockchain Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Connection Status */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-blue-400" />
              {stats?.enabled ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              )}
            </div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">Status</h3>
            <p className={`text-2xl font-bold ${stats?.enabled ? 'text-green-400' : 'text-yellow-400'}`}>
              {stats?.enabled ? 'Active' : 'Disabled'}
            </p>
          </div>

          {/* Total Events */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">Total Events</h3>
            <p className="text-2xl font-bold text-white">{stats?.totalEvents || 0}</p>
          </div>

          {/* Network */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 md:col-span-2">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Network</h3>
            <p className="text-lg font-semibold text-white mb-2">{stats?.network || 'N/A'}</p>
            <div className="text-xs text-slate-500 break-all">
              Contract: {stats?.contractAddress || 'N/A'}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* What is Blockchain Audit */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">🔗 What is Blockchain Audit?</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Immutable:</strong> Records cannot be modified or deleted</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Transparent:</strong> All actions are permanently logged</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Verifiable:</strong> Anyone can verify the authenticity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Tamper-Proof:</strong> Cryptographically secured</span>
              </li>
            </ul>
          </div>

          {/* Actions Logged */}
          <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 rounded-lg p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">📋 Actions Logged</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Product additions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Stock adjustments</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Product deletions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Payment transactions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Verify on Blockchain */}
        {stats?.contractAddress && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">🔍 Verify on Blockchain Explorer</h3>
            <p className="text-slate-400 mb-4">
              View all transactions and events on the Ethereum blockchain explorer
            </p>
            <a
              href={`https://sepolia.etherscan.io/address/${stats.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Activity className="w-4 h-4" />
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainAudit;
