
import React, { useState } from 'react';
import ProduceCard, { Produce } from '@/components/ProduceCard';
import InventoryForm from '@/components/InventoryForm';
import EditInventoryForm from '@/components/EditInventoryForm';
import AddProductForm from '@/components/marketplace/AddProductForm';
import { Plus, Minus, Filter, Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventory } from '@/hooks/useInventory';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';

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
  const [editingItem, setEditingItem] = useState<Produce | null>(null);
  const { inventory, isLoading, addItem, deleteItem, updateItem } = useInventory();
  const [selectedItem, setSelectedItem] = useState<Produce | null>(null);
  const [isAddingToMarketplace, setIsAddingToMarketplace] = useState(false);

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

  const handleAddToMarketplace = async (item: Produce, price: number) => {
    if (!item) return;
    
    try {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to add products to marketplace",
          variant: "destructive",
        });
        return;
      }
      
      const marketplaceItem = {
        user_id: data.user.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: price,
        harvest_date: item.harvestDate.toISOString().split('T')[0],
        expiry_date: item.expiryDate.toISOString().split('T')[0],
        farm_name: item.farmName,
        location: item.location,
        category: item.category,
        description: `${item.name} from ${item.farmName}`,
        image_url: item.image_url
      };

      const { error } = await supabase
        .from('marketplace_products')
        .insert(marketplaceItem);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Item added to marketplace successfully",
      });
      
      setIsAddingToMarketplace(false);
      setSelectedItem(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to marketplace",
        variant: "destructive",
      });
    }
  };

  const handleStartEdit = (produce: Produce) => {
    setEditingItem(produce);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleSaveEdit = async (updatedProduce: Omit<Produce, 'id'> & { image?: File }) => {
    if (!editingItem) return;
    
    try {
      await updateItem.mutateAsync({
        id: editingItem.id,
        produce: updatedProduce
      });
      
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
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
                <div key={produce.id} className="relative group">
                  <ProduceCard 
                    produce={produce}
                    showEditButton={true}
                    onEdit={() => handleStartEdit(produce)}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setSelectedItem(produce);
                        setIsAddingToMarketplace(true);
                      }}
                      className="p-2 bg-farmlink-primary text-white rounded-full hover:bg-farmlink-secondary transition-colors"
                      aria-label="Add to marketplace"
                    >
                      <ShoppingCart size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveProduce(produce.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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

            {editingItem && (
              <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Edit Item</DialogTitle>
                  </DialogHeader>
                  <EditInventoryForm
                    produce={editingItem}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                  />
                </DialogContent>
              </Dialog>
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

      <Dialog open={isAddingToMarketplace} onOpenChange={setIsAddingToMarketplace}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Marketplace</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedItem.image_url && (
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <img 
                      src={selectedItem.image_url} 
                      alt={selectedItem.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{selectedItem.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedItem.quantity} {selectedItem.unit} from {selectedItem.farmName}
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Set Price (₹/{selectedItem.unit})
                </label>
                <input
                  type="number"
                  id="price"
                  className="form-input w-full"
                  placeholder="Enter price in ₹"
                  min="0"
                  step="0.01"
                  required
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      const price = parseFloat(input.value);
                      if (price > 0) {
                        handleAddToMarketplace(selectedItem, price);
                      }
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingToMarketplace(false);
                    setSelectedItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={(e) => {
                    const priceInput = document.getElementById('price') as HTMLInputElement;
                    const price = parseFloat(priceInput.value);
                    if (price > 0) {
                      handleAddToMarketplace(selectedItem, price);
                    } else {
                      toast({
                        title: "Error",
                        description: "Please enter a valid price",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Add to Marketplace
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
