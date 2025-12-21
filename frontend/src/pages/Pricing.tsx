import { ShieldCheck } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Page Header */}
            <div className="bg-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Start for free, upgrade when you need more power. No hidden fees.</p>
                </div>
            </div>

            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                            <div className="text-4xl font-bold text-gray-900 mb-6">₹0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <p className="text-gray-600 mb-8">Perfect for small shops just getting digital.</p>
                            <Link to="/signup" className="block w-full py-3 px-4 bg-gray-100 text-gray-900 font-semibold rounded-lg text-center hover:bg-gray-200 transition-colors">Get Started</Link>
                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center gap-3 text-sm text-gray-600"><ShieldCheck className="w-4 h-4 text-green-500"/> Up to 100 Products</li>
                                <li className="flex items-center gap-3 text-sm text-gray-600"><ShieldCheck className="w-4 h-4 text-green-500"/> Basic Analytics</li>
                                <li className="flex items-center gap-3 text-sm text-gray-600"><ShieldCheck className="w-4 h-4 text-green-500"/> Single User</li>
                            </ul>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl transform scale-105 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                            <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
                            <div className="text-4xl font-bold text-white mb-6">₹999<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                            <p className="text-slate-400 mb-8">For growing businesses needing power.</p>
                            <Link to="/signup" className="block w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 transition-colors">Start Free Trial</Link>
                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck className="w-4 h-4 text-blue-400"/> Unlimited Products</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck className="w-4 h-4 text-blue-400"/> Blockchain Audit Logs</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck className="w-4 h-4 text-blue-400"/> AI Inventory Assistant</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck className="w-4 h-4 text-blue-400"/> 3 Staff Accounts</li>
                            </ul>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                            <div className="text-4xl font-bold text-gray-900 mb-6">Custom</div>
                            <p className="text-gray-600 mb-8">For large retail chains.</p>
                            <Link to="/signup" className="block w-full py-3 px-4 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors">Contact Sales</Link>
                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center gap-3 text-sm text-gray-600"><ShieldCheck className="w-4 h-4 text-green-500"/> Custom API Access</li>
                                <li className="flex items-center gap-3 text-sm text-gray-600"><ShieldCheck className="w-4 h-4 text-green-500"/> Dedicated Support</li>
                                <li className="flex items-center gap-3 text-sm text-gray-600"><ShieldCheck className="w-4 h-4 text-green-500"/> On-premise Deployment</li>
                            </ul>
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

export default Pricing;
