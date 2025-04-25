
import { supabase } from '@/integrations/supabase/client';

export const ensureInventoryImagesBucket = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      return;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'inventory-images');
    
    if (!bucketExists) {
      console.log("Creating inventory-images bucket");
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('inventory-images', {
        public: true,  // Make bucket public
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
      } else {
        console.log("Bucket created successfully");
      }
    } else {
      console.log("Bucket 'inventory-images' already exists");
    }
  } catch (err) {
    console.error("Error in ensureInventoryImagesBucket:", err);
  }
};
