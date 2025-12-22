import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

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
              Fulfill the velocity products or SKUs <br className="hidden md:block" />
              with <span className="text-blue-600">real-time demand</span> in your nearby Area!
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Using advanced Technologies like Blockchain, AI Demand prediction, and IoT Device setup.
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
