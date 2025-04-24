
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Equipment } from '@/types/equipment';

interface BorrowRequestFormProps {
  equipment: Equipment;
  onSubmit: (request: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    message?: string;
  }) => void;
  onClose: () => void;
}

const BorrowRequestForm: React.FC<BorrowRequestFormProps> = ({ equipment, onSubmit, onClose }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const request = {
      equipmentId: equipment.id,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      message: formData.get('message') as string,
    };
    
    onSubmit(request);
    form.reset();
    onClose();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request to Borrow {equipment.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input type="date" name="startDate" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Input type="date" name="endDate" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message to Owner</label>
            <Textarea 
              name="message" 
              placeholder="Explain your need for the equipment..." 
              required 
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Send Request</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BorrowRequestForm;
