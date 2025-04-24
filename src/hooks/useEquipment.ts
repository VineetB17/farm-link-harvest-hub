
import { useState, useEffect } from 'react';
import { Equipment } from '@/types/equipment';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [myBorrowings, setMyBorrowings] = useState<Equipment[]>([]);
  const [requestedItems, setRequestedItems] = useState<Equipment[]>([]);
  const [myListedItems, setMyListedItems] = useState<Equipment[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEquipment();
      setupRealtimeUpdates();
    }
  }, [user]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('equipment_listings')
        .select('*')
        .eq('available', true);

      if (equipmentError) throw equipmentError;
      // Convert database records to our Equipment type
      setEquipment(equipmentData?.map(item => ({
        ...item,
        status: item.status as 'available' | 'borrowed' | 'requested' | 'pending',
      })) || []);

      if (user) {
        // Fetch my listed items
        const { data: myListings } = await supabase
          .from('equipment_listings')
          .select('*')
          .eq('owner_id', user.id);
        
        // Convert to our Equipment type
        setMyListedItems(myListings?.map(item => ({
          ...item,
          status: item.status as 'available' | 'borrowed' | 'requested' | 'pending',
        })) || []);

        // Fetch my requested items
        const { data: myRequests } = await supabase
          .from('borrow_requests')
          .select('*, equipment_listings(*)')
          .eq('borrower_id', user.id);

        if (myRequests) {
          // Convert to our Equipment type
          setRequestedItems(myRequests.map(request => ({
            ...request.equipment_listings,
            status: request.equipment_listings.status as 'available' | 'borrowed' | 'requested' | 'pending',
          })));
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch equipment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeUpdates = () => {
    const channel = supabase
      .channel('equipment-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'equipment_listings' },
        (payload) => {
          console.log('Change received!', payload);
          fetchEquipment(); // Refresh data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAddEquipment = async (newItem: Omit<Equipment, 'id' | 'owner_id' | 'owner_name'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('equipment_listings')
        .insert([{
          ...newItem,
          owner_id: user.id,
          owner_name: user.name || user.email,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Equipment Added",
        description: "Your equipment has been listed for lending"
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive"
      });
    }
  };

  const handleBorrowRequest = async (request: any, selectedEquipment: Equipment | null) => {
    if (!selectedEquipment || !user) return;
    
    try {
      // Create borrow request
      const { data: borrowRequest, error: borrowError } = await supabase
        .from('borrow_requests')
        .insert([{
          equipment_id: selectedEquipment.id,
          borrower_id: user.id,
          borrower_name: user.name || user.email,
          start_date: request.startDate,
          end_date: request.endDate,
          message: request.message,
        }])
        .select()
        .single();

      if (borrowError) throw borrowError;

      // Update equipment status
      const { error: updateError } = await supabase
        .from('equipment_listings')
        .update({ 
          status: 'requested',
          available: false 
        })
        .eq('id', selectedEquipment.id);

      if (updateError) throw updateError;
      
      toast({
        title: "Request Sent",
        description: "Your borrow request has been sent to the owner"
      });

      fetchEquipment(); // Refresh the listings
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit borrow request",
        variant: "destructive"
      });
    }
  };

  const handleReturnEquipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment_listings')
        .update({ 
          status: 'available',
          available: true 
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Equipment Returned",
        description: "The equipment has been marked as returned"
      });

      fetchEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to return equipment",
        variant: "destructive"
      });
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Listing Removed",
        description: "Your equipment listing has been removed",
      });

      fetchEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete listing",
        variant: "destructive"
      });
    }
  };

  return {
    equipment,
    loading,
    myBorrowings,
    requestedItems,
    myListedItems,
    handleAddEquipment,
    handleBorrowRequest,
    handleReturnEquipment,
    handleDeleteListing
  };
};
