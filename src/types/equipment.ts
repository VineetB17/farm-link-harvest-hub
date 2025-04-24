
export interface Equipment {
  id: string;
  name: string;
  category: string;
  owner_id: string;
  owner_name: string;
  location: string;
  available: boolean;
  description: string;
  status: 'available' | 'borrowed' | 'requested' | 'pending';
  created_at?: string;
  updated_at?: string;
  image_url?: string | null;
  
  // Additional properties needed by EquipmentCard
  owner?: string; // For backward compatibility
  listedById?: string; // For backward compatibility
}

export interface BorrowRequest {
  id: string;
  equipment_id: string;
  borrower_id: string;
  borrower_name: string;
  start_date: string;
  end_date: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
  equipment_listings?: {
    id: string;
    name: string;
    category: string;
    owner_id: string;
    owner_name: string;
    location: string;
    available: boolean;
    description: string;
    status: string; // Changed from the strict type to string to match what Supabase returns
    created_at?: string;
    updated_at?: string;
    image_url?: string | null;
  }; // Defining the type explicitly with status as string
}

export interface LendingMessage {
  id: string;
  request_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}
