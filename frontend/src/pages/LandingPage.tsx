import { Link } from 'react-router-dom';
import { ArrowRight, Box, ShieldCheck, Zap, BarChart3, ScanLine, Smartphone } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">InvSystem</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#blockchain" className="text-gray-600 hover:text-gray-900 font-medium">Blockchain</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Now with AI & Blockchain
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              Manage your stock <br className="hidden md:block" />
              with <span className="text-blue-600">just a scan.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Take control of your inventory with our AI-powered platform. 
              Track items, generate bills, and audit everything on the blockchain. 
              Making retail hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                Start for free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-900 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[600px] bg-gradient-to-tr from-blue-100 to-purple-100 opacity-50 blur-[100px] rounded-full"></div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Specs Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Just scan a barcode or take a picture. Our AI automatically fills in details like title, price, and category.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Billing</h3>
              <p className="text-gray-600 leading-relaxed">
                Create professional invoices in seconds. Support for offline payments and digital receipts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Blockchain Audit</h3>
              <p className="text-gray-600 leading-relaxed">
                Every transaction is locked on the Ethereum blockchain. Tamper-proof history for absolute trust.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile First</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage your shop from anywhere. Works perfectly on your phone, tablet, or laptop.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Track sales, low stock alerts, and revenue growth with our beautiful dashboard.
              </p>
            </div>
            
            {/* CTA Box */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold text-white mb-3">Ready to modernize?</h3>
              <p className="text-slate-400 mb-6">Join 1000+ smart retailers today.</p>
              <Link to="/signup" className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Section */}
      <div id="blockchain" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-6">
                        <ShieldCheck className="w-8 h-8 text-purple-600" />
                    </div>
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

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
                <p className="text-gray-600 text-lg">Start for free, upgrade as you grow.</p>
            </div>
            
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

export default LandingPage;
