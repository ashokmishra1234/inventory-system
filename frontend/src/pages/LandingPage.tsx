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
