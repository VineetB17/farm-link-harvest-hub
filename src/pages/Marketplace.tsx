import React, { useEffect, useState } from 'react';
import ProduceCard, { Produce } from '@/components/ProduceCard';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const categories = [
  "All Categories",
  "Fruits",
  "Vegetables", 
  "Grains",
  "Dairy",
  "Nuts",
  "Other"
];

const Marketplace: React.FC = () => {
  const [marketItems, setMarketItems] = useState<Produce[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select('*');

      if (error) throw error;

      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: Number(item.quantity),
        unit: item.unit,
        harvestDate: new Date(item.harvest_date),
        expiryDate: new Date(item.expiry_date),
        farmName: item.farm_name,
        location: item.location,
        category: item.category,
        price: Number(item.price),
        image_url: item.image_url
      }));

      setMarketItems(formattedData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load marketplace items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = marketItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.farmName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="farmlink-container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-farmlink-secondary">Marketplace</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full"
            placeholder="Search by produce, farm name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === category 
                  ? 'bg-farmlink-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading marketplace items...</p>
        </div>
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MarketplaceCard key={item.id} produce={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No items found matching your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface MarketplaceCardProps {
  produce: Produce & { price?: number };
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ produce }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all">
      {produce.image_url && (
        <div className="aspect-video mb-3 rounded-md overflow-hidden">
          <img 
            src={produce.image_url} 
            alt={produce.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-farmlink-secondary">{produce.name}</h3>
          <p className="text-sm text-gray-600">{produce.farmName}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-farmlink-primary font-semibold bg-farmlink-light px-3 py-1 rounded-full">
            {produce.quantity} {produce.unit}
          </span>
          {produce.price && (
            <span className="text-green-600 font-bold mt-1">
              ₹{produce.price.toFixed(2)}/{produce.unit}
            </span>
          )}
        </div>
      </div>

      {produce.category && (
        <div className="flex items-center mb-3">
          <Filter size={16} className="text-farmlink-accent mr-2" />
          <span className="text-sm text-farmlink-accent">{produce.category}</span>
        </div>
      )}
      
      <p className="text-sm text-gray-600 mb-3">{produce.location}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Expires: {produce.expiryDate.toLocaleDateString()}
        </div>
        <button 
          className="flex items-center p-2 bg-farmlink-primary text-white rounded-md hover:bg-farmlink-secondary transition-colors"
        >
          <ShoppingCart size={16} className="mr-1" />
          <span>Purchase</span>
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
