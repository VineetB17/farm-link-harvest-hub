
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Equipment } from '@/types/equipment';
import { supabase } from '@/lib/supabase';
import ImageUpload from '@/components/ui/image-upload';

interface AddLendingItemFormProps {
  onSubmit: (item: Partial<Equipment>) => Promise<void> | void;
  onClose: () => void;
}

const AddLendingItemForm: React.FC<AddLendingItemFormProps> = ({ onSubmit, onClose }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {      
      const newItem = {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        location: formData.get('location') as string,
        image_url: imageUrl,
        available: true,
        status: 'available' as const
      };
      
      await onSubmit(newItem);
      form.reset();
      setImageUrl('');
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: 'Error',
        description: 'Failed to add equipment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Equipment for Lending</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Equipment Image</label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              bucketName="equipment-images"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Equipment Name</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              name="category" 
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              <option value="Tractors">Tractors</option>
              <option value="Harvesters">Harvesters</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Tools">Tools</option>
              <option value="Seeders">Seeders</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea name="description" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input name="location" required />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Equipment'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLendingItemForm;
