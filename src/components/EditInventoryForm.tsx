
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Produce } from './ProduceCard';
import ImageUpload from './ui/image-upload';

interface EditInventoryFormProps {
  produce: Produce;
  onSave: (produce: Omit<Produce, 'id'> & { image?: File }) => void;
  onCancel: () => void;
}

const categories = [
  "Fruits",
  "Vegetables", 
  "Grains",
  "Dairy",
  "Nuts",
  "Other"
];

const EditInventoryForm: React.FC<EditInventoryFormProps> = ({ produce, onSave, onCancel }) => {
  const [name, setName] = useState(produce.name);
  const [quantity, setQuantity] = useState(String(produce.quantity));
  const [unit, setUnit] = useState(produce.unit);
  const [harvestDate, setHarvestDate] = useState(produce.harvestDate.toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(produce.expiryDate.toISOString().split('T')[0]);
  const [farmName, setFarmName] = useState(produce.farmName);
  const [location, setLocation] = useState(produce.location);
  const [category, setCategory] = useState(produce.category || '');
  const [image, setImage] = useState<File | undefined>();
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

    const updatedProduce = {
      name,
      quantity: parseFloat(quantity),
      unit,
      harvestDate: new Date(harvestDate),
      expiryDate: new Date(expiryDate),
      farmName,
      location,
      category,
      image
    };

    onSave(updatedProduce);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Edit Item</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <ImageUpload 
              onImageSelect={(file) => setImage(file)}
              previewUrl={produce.image_url}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Produce Name</label>
            <input
              type="text"
              className="form-input w-full"
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
                className="form-input w-full"
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
                className="form-input w-full"
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
              className="form-input w-full"
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
              className="form-input w-full"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              className="form-input w-full"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Farm Name</label>
            <input
              type="text"
              className="form-input w-full"
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
              className="form-input w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., City, Region"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-farmlink-primary hover:bg-farmlink-secondary">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditInventoryForm;
