
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, BarChart, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-farmlink-light to-white py-16 md:py-24">
        <div className="farmlink-container">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-farmlink-secondary">
                Reduce Waste, Connect Farmers, Share Surplus
              </h1>
              <p className="text-lg mb-8 text-gray-700 max-w-lg">
                FarmLink helps farmers easily manage, track and exchange surplus produce, 
                reducing food waste and strengthening local agricultural communities.
              </p>
              <div className="flex space-x-4">
                <Link to="/signup" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/marketplace" className="btn-secondary">
                  View Marketplace
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img 
                src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Farmer with produce" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="farmlink-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-farmlink-secondary">
            Why Choose FarmLink?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-farmlink-light p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-farmlink-primary rounded-full flex items-center justify-center mb-4">
                <Leaf size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reduce Food Waste</h3>
              <p className="text-gray-700">
                Track inventory expiration dates and find opportunities to share or sell surplus produce before it goes to waste.
              </p>
            </div>
            
            <div className="bg-farmlink-light p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-farmlink-primary rounded-full flex items-center justify-center mb-4">
                <BarChart size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Manage Inventory</h3>
              <p className="text-gray-700">
                Keep track of all your surplus produce in one place with our easy-to-use inventory management system.
              </p>
            </div>
            
            <div className="bg-farmlink-light p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-farmlink-primary rounded-full flex items-center justify-center mb-4">
                <Clock size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Weather</h3>
              <p className="text-gray-700">
                Stay informed with real-time weather updates to help plan your harvesting and farming activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-farmlink-accent text-white">
        <div className="farmlink-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to optimize your farm's inventory?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using FarmLink to manage their surplus produce and connect with local farming communities.
          </p>
          <Link to="/signup" className="inline-flex items-center btn-primary bg-white text-farmlink-accent hover:bg-farmlink-light">
            Sign Up Now
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
