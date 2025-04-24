
import { Equipment } from '@/types/equipment';

export const sampleEquipmentData: Equipment[] = [
  {
    id: '101',
    name: 'John Deere Tractor',
    category: 'Tractors',
    owner: 'Singh Farms',
    location: 'Amritsar, Punjab',
    available: true,
    description: 'Medium-sized tractor suitable for most field operations.',
    status: 'available',
    listedById: 'other-user-1'
  },
  {
    id: '102',
    name: 'Irrigation System',
    category: 'Irrigation',
    owner: 'Green Valley Farms',
    location: 'Coimbatore, Tamil Nadu',
    available: true,
    description: 'Complete drip irrigation system for up to 2 acres.',
    status: 'available',
    listedById: 'other-user-2'
  },
  {
    id: '103',
    name: 'Harvest Combine',
    category: 'Harvesters',
    owner: 'Kumar Agro',
    location: 'Lucknow, Uttar Pradesh',
    available: false,
    description: 'Large combine harvester suitable for grain crops.',
    status: 'borrowed',
    listedById: 'other-user-3'
  },
  {
    id: '104',
    name: 'Seedling Planter',
    category: 'Seeders',
    owner: 'Patel Organics',
    location: 'Ahmedabad, Gujarat',
    available: true,
    description: 'Automated seedling planter with adjustable row spacing.',
    status: 'available'
  },
  {
    id: '105',
    name: 'Apple Sorting Machine',
    category: 'Processing',
    owner: 'Himachal Growers',
    location: 'Shimla, Himachal Pradesh',
    available: true,
    description: 'Automated fruit sorting system for medium-sized operations.',
    status: 'available'
  },
  {
    id: '106',
    name: 'Hand Tools Bundle',
    category: 'Tools',
    owner: 'Kerala Farms',
    location: 'Trivandrum, Kerala',
    available: true,
    description: 'Complete set of pruning and harvesting hand tools.',
    status: 'available'
  },
  {
    id: '107',
    name: 'Rotary Tiller',
    category: 'Tools',
    owner: 'Sharma Agriculture',
    location: 'Jaipur, Rajasthan',
    available: true,
    description: 'Heavy-duty tiller for preparing soil before planting.',
    status: 'available'
  },
  {
    id: '108',
    name: 'Rice Transplanter',
    category: 'Seeders',
    owner: 'Bengal Agro',
    location: 'Kolkata, West Bengal',
    available: true,
    description: 'Mechanical rice transplanter for efficient paddy planting.',
    status: 'available'
  },
  {
    id: '109',
    name: 'Sprinkler System',
    category: 'Irrigation',
    owner: 'Maharashtra Farms',
    location: 'Nagpur, Maharashtra',
    available: true,
    description: 'Medium-range sprinkler system for 3-4 acre coverage.',
    status: 'available'
  }
];
