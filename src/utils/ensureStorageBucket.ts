
import { supabase } from '@/lib/supabase';

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

export const ensureEquipmentImagesBucket = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      return;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'equipment-images');
    
    if (!bucketExists) {
      console.log("Creating equipment-images bucket");
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('equipment-images', {
        public: true,  // Make bucket public
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
      } else {
        console.log("Bucket created successfully");
      }
    } else {
      console.log("Bucket 'equipment-images' already exists");
    }
  } catch (err) {
    console.error("Error in ensureEquipmentImagesBucket:", err);
  }
};
