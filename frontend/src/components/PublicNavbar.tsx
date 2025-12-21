import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';

export const PublicNavbar = () => {
  return (
    <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">InvSystem</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link to="/blockchain-info" className="text-gray-600 hover:text-gray-900 font-medium">Blockchain</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
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
  );
};
