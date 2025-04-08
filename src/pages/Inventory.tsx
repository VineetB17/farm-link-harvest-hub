
import React, { useState } from 'react';
import ProduceCard, { Produce } from '@/components/ProduceCard';
import InventoryForm from '@/components/InventoryForm';
import { Plus, Minus } from 'lucide-react';
import { nanoid } from 'nanoid';

const Inventory: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
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
      location: 'Portland, OR'
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
      location: 'Portland, OR'
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
      location: 'Portland, OR'
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {inventory.map((produce) => (
          <ProduceCard key={produce.id} produce={produce} />
        ))}
      </div>

      {inventory.length === 0 && !showForm && (
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
