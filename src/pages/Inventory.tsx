import React, { useState } from 'react';
import ProduceCard, { Produce } from '@/components/ProduceCard';
import InventoryForm from '@/components/InventoryForm';
import AddProductForm from '@/components/marketplace/AddProductForm';
import { Plus, Minus, Filter, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventory } from '@/hooks/useInventory';

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
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const { inventory, isLoading, addItem, deleteItem } = useInventory();

  const handleAddProduce = async (produce: Omit<Produce, 'id'>) => {
    try {
      await addItem.mutateAsync(produce);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Item added to inventory successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item",
        variant: "destructive",
      });
    }
  };

  const handleRemoveProduce = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({
        title: "Success",
        description: "Item removed from inventory",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const filteredInventory = inventory.filter(item => 
    selectedCategory === 'All Categories' || item.category === selectedCategory
  );

  return (
    <div className="farmlink-container py-10">
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">My Inventory</TabsTrigger>
          <TabsTrigger value="marketplace">Add to Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-farmlink-secondary">My Inventory</h2>
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
                <div key={produce.id} className="relative">
                  <ProduceCard produce={produce} />
                  <button
                    onClick={() => handleRemoveProduce(produce.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
        </TabsContent>

        <TabsContent value="marketplace">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-farmlink-secondary">Add Product to Marketplace</h2>
            <AddProductForm onSuccess={() => toast({
              title: "Success",
              description: "Your product has been added to the marketplace"
            })} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
