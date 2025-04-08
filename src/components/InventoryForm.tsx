
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Produce } from './ProduceCard';

const categories = [
  "Fruits",
  "Vegetables", 
  "Grains",
  "Dairy",
  "Nuts",
  "Other"
];

interface InventoryFormProps {
  onAddProduce: (produce: Omit<Produce, 'id'>) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onAddProduce }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [harvestDate, setHarvestDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !quantity || !harvestDate || !expiryDate || !farmName || !location || !category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const newProduce = {
      name,
      quantity: parseFloat(quantity),
      unit,
      imageUrl: '/placeholder.svg', // Placeholder image
      harvestDate: new Date(harvestDate),
      expiryDate: new Date(expiryDate),
      farmName,
      location,
      category
    };

    onAddProduce(newProduce);

    // Reset form
    setName('');
    setQuantity('');
    setUnit('kg');
    setHarvestDate('');
    setExpiryDate('');
    setCategory('');
    
    toast({
      title: 'Success',
      description: 'Produce added to inventory',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Add New Produce</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Produce Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tomatoes"
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 10"
                min="0"
                step="0.1"
                required
              />
            </div>
            
            <div className="w-24">
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select
                className="form-input"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
                <option value="boxes">boxes</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Harvest Date</label>
            <input
              type="date"
              className="form-input"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              className="form-input"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Farm Name</label>
            <input
              type="text"
              className="form-input"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="e.g., Green Acres Farm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Mumbai, Maharashtra"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-farmlink-primary hover:bg-farmlink-secondary">
            Add to Inventory
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;
