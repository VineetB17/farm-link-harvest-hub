
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Produce } from '@/components/ProduceCard';

export const useInventory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        harvestDate: new Date(item.harvest_date),
        expiryDate: new Date(item.expiry_date),
        farmName: item.farm_name,
        location: item.location,
        category: item.category,
        image_url: item.image_url
      }));
    },
    enabled: !!user
  });

  const addItem = useMutation({
    mutationFn: async (produce: Omit<Produce, 'id'> & { image?: File, image_url?: string }) => {
      if (!user) throw new Error('User must be logged in');
      
      console.log('Adding item with image URL:', produce.image_url);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          user_id: user.id,
          name: produce.name,
          quantity: produce.quantity,
          unit: produce.unit,
          harvest_date: produce.harvestDate.toISOString(),
          expiry_date: produce.expiryDate.toISOString(),
          farm_name: produce.farmName,
          location: produce.location,
          category: produce.category,
          image_url: produce.image_url // Use the image URL from ImageUpload component
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  const updateItem = useMutation({
    mutationFn: async (params: { id: string; produce: Omit<Produce, 'id'> & { image?: File, image_url?: string } }) => {
      if (!user) throw new Error('User must be logged in');
      
      console.log('Updating item with image URL:', params.produce.image_url);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .update({
          name: params.produce.name,
          quantity: params.produce.quantity,
          unit: params.produce.unit,
          harvest_date: params.produce.harvestDate.toISOString(),
          expiry_date: params.produce.expiryDate.toISOString(),
          farm_name: params.produce.farmName,
          location: params.produce.location,
          category: params.produce.category,
          image_url: params.produce.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  return {
    inventory,
    isLoading,
    addItem,
    deleteItem,
    updateItem
  };
};
