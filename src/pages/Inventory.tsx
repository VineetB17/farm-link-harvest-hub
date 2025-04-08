
import React, { useState } from 'react';
import ProduceCard, { Produce } from '@/components/ProduceCard';
import InventoryForm from '@/components/InventoryForm';
import { Plus, Minus, Filter } from 'lucide-react';
import { nanoid } from 'nanoid';

const categories = [
  "All Categories",
  "Fruits",
  "Vegetables", 
  "Grains",
  "Dairy",
  "Nuts",
  "Other"
];

const Inventory: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [inventory, setInventory] = useState<Produce[]>([
    {
      id: '1',
      name: 'Tomatoes',
      quantity: 15,
      unit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfca',
      harvestDate: new Date('2025-04-01'),
      expiryDate: new Date('2025-04-15'),
      farmName: 'Green Valley Farm',
      location: 'Mumbai, Maharashtra',
      category: 'Vegetables'
    },
    {
      id: '2',
      name: 'Lettuce',
      quantity: 8,
      unit: 'boxes',
      imageUrl: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9',
      harvestDate: new Date('2025-04-02'),
      expiryDate: new Date('2025-04-08'),
      farmName: 'Green Valley Farm',
      location: 'Delhi, Delhi',
      category: 'Vegetables'
    },
    {
      id: '3',
      name: 'Carrots',
      quantity: 25,
      unit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1447175008436-054170c2e979',
      harvestDate: new Date('2025-04-01'),
      expiryDate: new Date('2025-04-30'),
      farmName: 'Green Valley Farm',
      location: 'Bangalore, Karnataka',
      category: 'Vegetables'
    },
    {
      id: '4',
      name: 'Apples',
      quantity: 40,
      unit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a',
      harvestDate: new Date('2025-04-01'),
      expiryDate: new Date('2025-04-25'),
      farmName: 'Green Valley Farm',
      location: 'Shimla, Himachal Pradesh',
      category: 'Fruits'
    },
    {
      id: '5',
      name: 'Wheat',
      quantity: 100,
      unit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1bdbd3b8f',
      harvestDate: new Date('2025-03-25'),
      expiryDate: new Date('2025-06-25'),
      farmName: 'Green Valley Farm',
      location: 'Ludhiana, Punjab',
      category: 'Grains'
    }
  ]);

  const handleAddProduce = (produce: Omit<Produce, 'id'>) => {
    const newProduce = {
      ...produce,
      id: nanoid()
    };
    
    setInventory([newProduce, ...inventory]);
    setShowForm(false);
  };

  const filteredInventory = inventory.filter(item => 
    selectedCategory === 'All Categories' || item.category === selectedCategory
  );

  return (
    <div className="farmlink-container py-10">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-farmlink-secondary">My Inventory</h1>
        <button 
          className="flex items-center btn-primary mt-4 sm:mt-0"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <Minus size={18} className="mr-2" />
              Close Form
            </>
          ) : (
            <>
              <Plus size={18} className="mr-2" />
              Add New Produce
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <InventoryForm onAddProduce={handleAddProduce} />
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Filter size={18} className="text-farmlink-primary mr-2" />
          <span className="text-gray-700">Filter by Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === category 
                  ? 'bg-farmlink-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredInventory.map((produce) => (
          <ProduceCard key={produce.id} produce={produce} />
        ))}
      </div>

      {filteredInventory.length === 0 && !showForm && (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">You don't have any produce in your inventory yet.</p>
          <button 
            className="flex items-center btn-primary mx-auto"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} className="mr-2" />
            Add New Produce
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
