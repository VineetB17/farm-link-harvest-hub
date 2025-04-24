
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Equipment, BorrowRequest, LendingMessage } from '@/types/equipment';
import { useToast } from "@/hooks/use-toast";
import AddLendingItemForm from '@/components/lending/AddLendingItemForm';
import BorrowRequestForm from '@/components/lending/BorrowRequestForm';
import CategoryFilter from '@/components/lending/CategoryFilter';
import LendingTabs from '@/components/lending/LendingTabs';
import MessagingDialog from '@/components/lending/MessagingDialog';
import { useEquipment } from '@/hooks/useEquipment';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const categories = [
  "All Categories",
  "Tractors",
  "Harvesters", 
  "Irrigation",
  "Tools",
  "Seeders",
  "Processing"
];

const Lending: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);
  const [messages, setMessages] = useState<LendingMessage[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    equipment,
    loading,
    myBorrowings,
    requestedItems,
    myListedItems,
    borrowRequests,
    handleAddEquipment,
    handleBorrowRequest,
    handleReturnEquipment,
    handleDeleteListing,
    handleAcceptRequest,
    handleDeclineRequest
  } = useEquipment();

  useEffect(() => {
    if (selectedRequest) {
      fetchMessages(selectedRequest.id);
      
      // Set up real-time subscription for messages
      const channel = supabase
        .channel('lending-messages')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'lending_messages', filter: `request_id=eq.${selectedRequest.id}` },
          (payload) => {
            // Add the new message to the list
            const newMessage = payload.new as LendingMessage;
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedRequest]);

  const fetchMessages = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('lending_messages')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!user || !selectedRequest) return;
    
    try {
      const { data, error } = await supabase
        .from('lending_messages')
        .insert([{
          request_id: selectedRequest.id,
          sender_id: user.id,
          sender_name: user.name || user.email,
          message: message
        }])
        .select();
        
      if (error) throw error;
      
      // The message will be added via the real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleMessageRequest = (request: BorrowRequest) => {
    setSelectedRequest(request);
    setShowMessageDialog(true);
  };

  const handleCloseMessageDialog = () => {
    setShowMessageDialog(false);
    setSelectedRequest(null);
    setMessages([]);
  };

  const handleBorrowClick = (equipment: Equipment) => {
    // Prevent borrowing own equipment
    if (user && (equipment.owner_id === user.id || equipment.owner_name === user.name)) {
      return;
    }
    setSelectedEquipment(equipment);
    setShowBorrowForm(true);
  };

  const filteredItems = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    // Filter out items listed by the current user from the available tab
    const isNotOwnItem = !(user && (item.owner_id === user.id || item.owner_name === user.name));
    
    return matchesSearch && matchesCategory && isNotOwnItem;
  });

  return (
    <div className="farmlink-container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-farmlink-secondary">Equipment Lending</h1>
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          List Equipment
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddLendingItemForm 
            onSubmit={handleAddEquipment}
            onClose={() => setShowAddForm(false)}
          />
        </div>
      )}

      {showBorrowForm && selectedEquipment && (
        <div className="mb-6">
          <BorrowRequestForm 
            equipment={selectedEquipment}
            onSubmit={(request) => {
              handleBorrowRequest(request, selectedEquipment);
              setShowBorrowForm(false);
              setSelectedEquipment(null);
            }}
            onClose={() => {
              setShowBorrowForm(false);
              setSelectedEquipment(null);
            }}
          />
        </div>
      )}

      <LendingTabs
        equipment={filteredItems}
        loading={loading}
        myBorrowings={myBorrowings}
        requestedItems={requestedItems}
        myListedItems={myListedItems}
        borrowRequests={borrowRequests}
        onBorrowClick={handleBorrowClick}
        onReturnEquipment={handleReturnEquipment}
        onDeleteListing={handleDeleteListing}
        onMessageRequest={handleMessageRequest}
        onAcceptRequest={handleAcceptRequest}
        onDeclineRequest={handleDeclineRequest}
      />

      {showMessageDialog && selectedRequest && (
        <MessagingDialog 
          isOpen={showMessageDialog}
          onClose={handleCloseMessageDialog}
          borrowRequest={selectedRequest}
          onSendMessage={handleSendMessage}
          messages={messages}
        />
      )}
    </div>
  );
};

export default Lending;
