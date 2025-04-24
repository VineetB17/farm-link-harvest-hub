
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Equipment } from '@/types/equipment';

interface AddLendingItemFormProps {
  onSubmit: (item: Partial<Equipment>) => void;
  onClose: () => void;
}

const AddLendingItemForm: React.FC<AddLendingItemFormProps> = ({ onSubmit, onClose }) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newItem = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      available: true,
      status: 'available' as const
    };
    
    onSubmit(newItem);
    form.reset();
    onClose();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Equipment for Lending</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Equipment Name</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input name="category" required />
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
            <Button type="submit">Add Equipment</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLendingItemForm;
