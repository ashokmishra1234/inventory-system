import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, X } from 'lucide-react';

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">InvSystem</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link to="/blockchain-info" className="text-gray-600 hover:text-gray-900 font-medium">Blockchain</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
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

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden text-gray-600 p-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden border-t border-gray-100 absolute w-full bg-white shadow-lg">
                <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
                    <Link to="/features" className="block py-2 text-gray-600 font-medium" onClick={() => setIsOpen(false)}>Features</Link>
                    <Link to="/blockchain-info" className="block py-2 text-gray-600 font-medium" onClick={() => setIsOpen(false)}>Blockchain</Link>
                    <Link to="/pricing" className="block py-2 text-gray-600 font-medium" onClick={() => setIsOpen(false)}>Pricing</Link>
                    <hr className="border-gray-100" />
                    <Link to="/login" className="block py-2 text-gray-600 font-medium" onClick={() => setIsOpen(false)}>Log in</Link>
                    <Link to="/signup" className="block w-full bg-black text-white text-center py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors" onClick={() => setIsOpen(false)}>
                        Get Started
                    </Link>
                </div>
            </div>
        )}
      </nav>
  );
};
