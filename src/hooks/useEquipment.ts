import { useState, useEffect } from 'react';
import { Equipment, BorrowRequest } from '@/types/equipment';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [myBorrowings, setMyBorrowings] = useState<Equipment[]>([]);
  const [requestedItems, setRequestedItems] = useState<Equipment[]>([]);
  const [myListedItems, setMyListedItems] = useState<Equipment[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<BorrowRequest[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEquipment();
      fetchIncomingRequests();
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

  const fetchIncomingRequests = async () => {
    if (!user) return;

    try {
      const { data: myListings } = await supabase
        .from('equipment_listings')
        .select('id')
        .eq('owner_id', user.id);

      if (myListings && myListings.length > 0) {
        const listingIds = myListings.map(listing => listing.id);
        
        const { data: requests } = await supabase
          .from('borrow_requests')
          .select('*, equipment_listings(*)')
          .in('equipment_id', listingIds)
          .eq('status', 'pending');

        if (requests) {
          setIncomingRequests(requests);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch incoming requests",
        variant: "destructive"
      });
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

  const handleAddEquipment = async (newItem: Partial<Equipment>): Promise<void> => {
    if (!user) return;
    
    try {
      console.log("Adding equipment with image:", newItem.image_url);
      
      // Fix: Ensure all required fields are present in the equipment object
      const equipmentData = {
        name: newItem.name || '',
        category: newItem.category || '',
        description: newItem.description || '',
        location: newItem.location || '',
        image_url: newItem.image_url,
        owner_id: user.id,
        owner_name: user.name || user.email || '',
      };
      
      const { data, error } = await supabase
        .from('equipment_listings')
        .insert([equipmentData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Equipment Added",
        description: "Your equipment has been listed for lending"
      });
      
      // Refresh equipment listings
      fetchEquipment();
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

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return;

    try {
      // Update borrow request status to accepted
      const { data: updatedRequest, error: requestError } = await supabase
        .from('borrow_requests')
        .update({ 
          status: 'accepted', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', requestId)
        .select()
        .single();

      if (requestError) throw requestError;

      // Update equipment status to borrowed
      const { error: equipmentError } = await supabase
        .from('equipment_listings')
        .update({ 
          status: 'borrowed', 
          available: false 
        })
        .eq('id', updatedRequest.equipment_id);

      if (equipmentError) throw equipmentError;

      toast({
        title: "Request Accepted",
        description: "You've accepted the borrow request"
      });

      // Refresh data
      fetchEquipment();
      fetchIncomingRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept request",
        variant: "destructive"
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!user) return;

    try {
      // Update borrow request status to declined
      const { data: updatedRequest, error: requestError } = await supabase
        .from('borrow_requests')
        .update({ 
          status: 'declined', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', requestId)
        .select()
        .single();

      if (requestError) throw requestError;

      toast({
        title: "Request Declined",
        description: "You've declined the borrow request"
      });

      // Refresh data
      fetchEquipment();
      fetchIncomingRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to decline request",
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
    handleDeleteListing,
    incomingRequests,
    handleAcceptRequest,
    handleDeclineRequest
  };
};
