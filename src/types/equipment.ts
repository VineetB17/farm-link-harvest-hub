
export interface Equipment {
  id: string;
  name: string;
  category: string;
  owner: string;
  location: string;
  available: boolean;
  description: string;
  status?: 'available' | 'borrowed' | 'requested' | 'pending';
}

