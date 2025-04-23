
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface BorrowRequestFormProps {
  equipment: {
    id: string;
    name: string;
    owner: string;
  };
  onSubmit: (request: any) => void;
  onClose: () => void;
}

const BorrowRequestForm: React.FC<BorrowRequestFormProps> = ({ equipment, onSubmit, onClose }) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const request = {
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      owner: equipment.owner,
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      message: formData.get('message'),
      status: 'pending'
    };
    
    onSubmit(request);
    toast({
      title: "Request Sent",
      description: "Your borrow request has been sent to the owner",
    });
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
            <Textarea name="message" placeholder="Explain your need for the equipment..." required />
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
