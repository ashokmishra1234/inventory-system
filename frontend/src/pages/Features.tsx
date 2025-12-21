import { ScanLine, Zap, ShieldCheck, Smartphone, BarChart3 } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      {/* Page Header */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Features that empower retail</h1>
             <p className="text-xl text-slate-400 max-w-2xl mx-auto">Everything you need to run your shop efficiently, from AI inventory to blockchain audits.</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gray-50">
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

export default Features;
