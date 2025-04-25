
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

  const uploadImage = async (file: File) => {
    if (!file) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading image:', filePath);
      
      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('inventory-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      console.log('Image uploaded successfully:', data);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('inventory-images')
        .getPublicUrl(filePath);

      console.log('Image public URL:', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Error in upload process:', error);
      throw error;
    }
  };

  const addItem = useMutation({
    mutationFn: async (produce: Omit<Produce, 'id'> & { image?: File }) => {
      if (!user) throw new Error('User must be logged in');
      
      let imageUrl = null;
      if (produce.image) {
        imageUrl = await uploadImage(produce.image);
      }
      
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
          image_url: imageUrl
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
    mutationFn: async (params: { id: string; produce: Omit<Produce, 'id'> & { image?: File } }) => {
      if (!user) throw new Error('User must be logged in');
      
      let imageUrl = null;
      if (params.produce.image) {
        imageUrl = await uploadImage(params.produce.image);
      }
      
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
          ...(imageUrl && { image_url: imageUrl }),
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
