
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-farmlink-secondary text-white mt-auto">
      <div className="farmlink-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FarmLink</h3>
            <p className="text-sm opacity-80">
              Connecting farmers, reducing waste, and strengthening local agricultural communities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm opacity-80 hover:opacity-100">Home</Link></li>
              <li><Link to="/marketplace" className="text-sm opacity-80 hover:opacity-100">Marketplace</Link></li>
              <li><Link to="/weather" className="text-sm opacity-80 hover:opacity-100">Weather</Link></li>
              <li><Link to="/about" className="text-sm opacity-80 hover:opacity-100">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm opacity-80">Email: info@farmlink.com</p>
            <p className="text-sm opacity-80">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-4 text-sm opacity-70 text-center">
          &copy; {new Date().getFullYear()} FarmLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
