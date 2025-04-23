
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AddLendingItemFormProps {
  onSubmit: (item: any) => void;
  onClose: () => void;
}

const AddLendingItemForm: React.FC<AddLendingItemFormProps> = ({ onSubmit, onClose }) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newItem = {
      id: Date.now().toString(),
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description'),
      location: formData.get('location'),
      available: true
    };
    
    onSubmit(newItem);
    toast({
      title: "Equipment Added",
      description: "Your equipment has been listed for lending",
    });
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
