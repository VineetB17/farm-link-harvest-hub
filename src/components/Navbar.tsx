
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="farmlink-container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-farmlink-primary rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="ml-2 text-xl font-bold text-farmlink-secondary">FarmLink</span>
            </Link>
          </div>
          
          {isMobile ? (
            <>
              <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white z-50 shadow-md">
                  <div className="farmlink-container py-4 flex flex-col gap-4">
                    <Link to="/" className="text-gray-700 hover:text-farmlink-primary" onClick={toggleMenu}>Home</Link>
                    <Link to="/marketplace" className="text-gray-700 hover:text-farmlink-primary" onClick={toggleMenu}>Marketplace</Link>
                    {isLoggedIn ? (
                      <>
                        <Link to="/inventory" className="text-gray-700 hover:text-farmlink-primary" onClick={toggleMenu}>My Inventory</Link>
                        <Link to="/weather" className="text-gray-700 hover:text-farmlink-primary" onClick={toggleMenu}>Weather</Link>
                        <button 
                          onClick={() => {
                            onLogout();
                            toggleMenu();
                          }}
                          className="flex items-center text-gray-700 hover:text-farmlink-primary"
                        >
                          <LogOut size={18} className="mr-1" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="text-gray-700 hover:text-farmlink-primary" onClick={toggleMenu}>Login</Link>
                        <Link to="/signup" className="btn-primary" onClick={toggleMenu}>Sign Up</Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-farmlink-primary">Home</Link>
                <Link to="/marketplace" className="text-gray-700 hover:text-farmlink-primary">Marketplace</Link>
                {isLoggedIn && (
                  <>
                    <Link to="/inventory" className="text-gray-700 hover:text-farmlink-primary">My Inventory</Link>
                    <Link to="/weather" className="text-gray-700 hover:text-farmlink-primary">Weather</Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/profile">
                      <Button variant="ghost" className="flex items-center text-gray-700">
                        <User size={18} className="mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button onClick={onLogout} variant="ghost" className="flex items-center text-gray-700">
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-farmlink-primary">Login</Link>
                    <Link to="/signup" className="btn-primary">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
