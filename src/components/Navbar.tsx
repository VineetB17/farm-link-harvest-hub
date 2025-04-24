import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, CloudRain, Home, ShoppingCart, Package, Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
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
                    <Link to="/" className="text-gray-700 hover:text-farmlink-primary flex items-center" onClick={toggleMenu}>
                      <Home size={18} className="mr-2" /> Home
                    </Link>
                    <Link to="/marketplace" className="text-gray-700 hover:text-farmlink-primary flex items-center" onClick={toggleMenu}>
                      <ShoppingCart size={18} className="mr-2" /> Marketplace
                    </Link>
                    {isLoggedIn ? (
                      <>
                        <Link to="/inventory" className="text-gray-700 hover:text-farmlink-primary flex items-center" onClick={toggleMenu}>
                          <Warehouse size={18} className="mr-2" /> My Inventory
                        </Link>
                        <Link to="/lending" className="text-gray-700 hover:text-farmlink-primary flex items-center" onClick={toggleMenu}>
                          <Package size={18} className="mr-2" /> Equipment Lending
                        </Link>
                        <Link to="/weather" className="text-gray-700 hover:text-farmlink-primary flex items-center" onClick={toggleMenu}>
                          <CloudRain size={18} className="mr-2" /> Weather
                        </Link>
                        <Link to="/profile" className="text-gray-700 hover:text-farmlink-primary flex items-center" onClick={toggleMenu}>
                          <User size={18} className="mr-2" /> My Profile
                        </Link>
                        <button 
                          onClick={() => {
                            logout();
                            toggleMenu();
                          }}
                          className="flex items-center text-gray-700 hover:text-farmlink-primary"
                        >
                          <LogOut size={18} className="mr-2" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="text-gray-700 hover:text-farmlink-primary flex items-center" onClick={toggleMenu}>
                          <User size={18} className="mr-2" /> Login
                        </Link>
                        <Link to="/signup" className="btn-primary flex items-center justify-center" onClick={toggleMenu}>
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-farmlink-primary flex items-center">
                  <Home size={18} className="mr-1" /> Home
                </Link>
                <Link to="/marketplace" className="text-gray-700 hover:text-farmlink-primary flex items-center">
                  <ShoppingCart size={18} className="mr-1" /> Marketplace
                </Link>
                {isLoggedIn && (
                  <>
                    <Link to="/inventory" className="text-gray-700 hover:text-farmlink-primary flex items-center">
                      <Warehouse size={18} className="mr-1" /> My Inventory
                    </Link>
                    <Link to="/lending" className="text-gray-700 hover:text-farmlink-primary flex items-center">
                      <Package size={18} className="mr-1" /> Equipment Lending
                    </Link>
                    <Link to="/weather" className="text-gray-700 hover:text-farmlink-primary flex items-center">
                      <CloudRain size={18} className="mr-1" /> Weather
                    </Link>
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
                    <Button onClick={logout} variant="ghost" className="flex items-center text-gray-700">
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
