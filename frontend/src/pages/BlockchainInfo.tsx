import { ShieldCheck } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';

const BlockchainInfo = () => {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Page Header */}
            <div className="bg-purple-900 py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/50 rounded-full text-purple-200 text-sm font-medium mb-6 backdrop-blur-sm border border-purple-700">
                        <ShieldCheck className="w-4 h-4" />
                        Powered by Ethereum
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Immutable Trust</h1>
                    <p className="text-xl text-purple-200 max-w-2xl mx-auto">See how we use blockchain technology to create an unbreakable audit trail for your inventory.</p>
                </div>
            </div>

            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Trust built on code, <br />not promises.</h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                In traditional systems, history can be edited. In our platform, every critical inventory action is recorded on the <strong>Ethereum Blockchain</strong> (Sepolia Testnet).
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Cannot be deleted or modified by anyone (even us)",
                                    "Publicly verifiable audit trail for investors",
                                    "Prevents internal fraud and stock manipulation",
                                    "Cryptographically secured transactions"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                        </div>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 bg-slate-900 p-8 rounded-2xl shadow-xl w-full">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-slate-500 text-sm ml-2">Blockchain Explorer</span>
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-green-500">
                                    <div className="text-green-400 mb-1">Status: Confirmed</div>
                                    <div className="text-slate-300">Hash: 0x7f...3a2b</div>
                                    <div className="text-slate-500 mt-2">Action: Stock Updated (+50 Units)</div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <div className="text-blue-400 mb-1">Status: Confirmed</div>
                                    <div className="text-slate-300">Hash: 0x8a...9c1d</div>
                                    <div className="text-slate-500 mt-2">Action: New Product Added</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center opacity-60 text-sm text-gray-600">
                        <p>© 2025 InvSystem. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-gray-900">Privacy</a>
                            <a href="#" className="hover:text-gray-900">Terms</a>
                            <a href="#" className="hover:text-gray-900">Twitter</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BlockchainInfo;
