
import React, { useEffect, useState } from 'react';
import ProduceCard, { Produce } from '@/components/ProduceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Trash2, Handshake } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import RequestsSection from '@/components/marketplace/RequestsSection';
import HistorySection from '@/components/marketplace/HistorySection';
import { Button } from '@/components/ui/button';

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
  const [offers, setOffers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchMarketplaceItems();
    fetchMarketplaceOffers();
    fetchOffersHistory();
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
        image_url: item.image_url,
        user_id: item.user_id
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

  const fetchMarketplaceOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_offers')
        .select(`
          *,
          marketplace_products!inner(name, user_id)
        `);

      if (error) throw error;

      setOffers(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load marketplace offers',
        variant: 'destructive',
      });
    }
  };

  const fetchOffersHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_offers_history')
        .select('*')
        .order('action_date', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load offers history',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item removed from marketplace",
      });

      fetchMarketplaceItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  const handleMakeOffer = async (produce: Produce) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to make an offer',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('marketplace_offers')
        .insert({
          product_id: produce.id,
          user_id: user.id,
          offer_amount: produce.price,
          message: `I'm interested in purchasing ${produce.name}`
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your offer has been sent to the seller",
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to make offer',
        variant: 'destructive',
      });
    }
  };

  const handleAcceptOffer = async (offerId: string, productId: string) => {
    try {
      const offer = offers.find(o => o.id === offerId);
      if (!offer) throw new Error('Offer not found');

      const { error: offerError } = await supabase
        .from('marketplace_offers')
        .update({ status: 'accepted' })
        .eq('id', offerId);

      if (offerError) throw offerError;

      const { error: productError } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('id', productId);

      if (productError) throw productError;

      const { error: historyError } = await supabase
        .from('marketplace_offers_history')
        .insert({
          offer_id: offerId,
          product_name: offer.marketplace_products.name,
          buyer_name: offer.borrower_name || 'Unknown',
          offer_amount: offer.offer_amount,
          status: 'accepted',
          seller_id: user?.id,
          message: offer.message
        });

      if (historyError) throw historyError;

      toast({
        title: 'Success',
        description: 'Offer accepted and item removed from marketplace',
      });

      fetchMarketplaceItems();
      fetchMarketplaceOffers();
      fetchOffersHistory();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to accept offer',
        variant: 'destructive',
      });
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      const offer = offers.find(o => o.id === offerId);
      if (!offer) throw new Error('Offer not found');

      const { error: offerError } = await supabase
        .from('marketplace_offers')
        .update({ status: 'rejected' })
        .eq('id', offerId);

      if (offerError) throw offerError;

      const { error: historyError } = await supabase
        .from('marketplace_offers_history')
        .insert({
          offer_id: offerId,
          product_name: offer.marketplace_products.name,
          buyer_name: offer.borrower_name || 'Unknown',
          offer_amount: offer.offer_amount,
          status: 'rejected',
          seller_id: user?.id,
          message: offer.message
        });

      if (historyError) throw historyError;

      toast({
        title: 'Success',
        description: 'Offer rejected',
      });

      fetchMarketplaceOffers();
      fetchOffersHistory();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject offer',
        variant: 'destructive',
      });
    }
  };

  const filteredItems = marketItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.farmName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const offersByCurrentUser = offers.filter(
    offer => offer.marketplace_products.user_id === user?.id
  );

  return (
    <div className="farmlink-container py-10">
      <Tabs defaultValue="marketplace" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="requests">Requests ({offersByCurrentUser.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading marketplace items...</p>
            </div>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <MarketplaceCard 
                      key={item.id} 
                      produce={item} 
                      isOwner={user?.id === item.user_id}
                      onDelete={handleDelete}
                      onMakeOffer={handleMakeOffer}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No items found matching your search criteria.</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="requests">
          <RequestsSection
            requests={offersByCurrentUser}
            onAccept={handleAcceptOffer}
            onReject={handleRejectOffer}
          />
        </TabsContent>

        <TabsContent value="history">
          <HistorySection history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MarketplaceCardProps {
  produce: Produce & { price?: number; user_id?: string };
  isOwner: boolean;
  onDelete: (id: string) => void;
  onMakeOffer: (produce: Produce) => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ produce, isOwner, onDelete, onMakeOffer }) => {
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
        {isOwner ? (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(produce.id)}
          >
            <Trash2 size={16} className="mr-1" />
            Remove
          </Button>
        ) : (
          <Button 
            variant="default"
            size="sm"
            onClick={() => onMakeOffer(produce)}
          >
            <Handshake size={16} className="mr-1" />
            Make Offer
          </Button>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
