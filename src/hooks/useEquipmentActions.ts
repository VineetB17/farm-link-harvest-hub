
import { Equipment } from '@/types/equipment';
import { useToast } from "@/components/ui/use-toast";

export const useEquipmentActions = () => {
  const { toast } = useToast();

  const handleAddEquipment = (newItem: Equipment, userId: string, userName: string) => {
    const listedItem = {
      ...newItem,
      status: 'available' as const,
      available: true,
      listedById: userId,
      owner: userName || ''
    };
    
    return listedItem;
  };

  const handleBorrowRequest = (equipmentId: string) => {
    toast({
      title: "Request Sent",
      description: "Your borrow request has been sent"
    });
  };

  const handleReturnEquipment = (id: string, itemName: string) => {
    toast({
      title: "Equipment Returned",
      description: `You have successfully returned ${itemName}`,
    });
  };
  
  const handleDeleteListing = () => {
    toast({
      title: "Listing Removed",
      description: "Your equipment listing has been removed",
    });
  };

  return {
    handleAddEquipment,
    handleBorrowRequest,
    handleReturnEquipment,
    handleDeleteListing
  };
};
