
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/image-upload";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  "Fruits",
  "Vegetables", 
  "Grains",
  "Dairy",
  "Nuts",
  "Other"
];

interface AddProductFormProps {
  onSuccess: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    harvestDate: '',
    expiryDate: '',
    farmName: '',
    location: '',
    category: '',
    description: ''
  });

  const handleImageSelect = (file: File) => {
    setProductImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add products",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      
      if (productImage) {
        const fileExt = productImage.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('marketplace-images')
          .upload(filePath, productImage);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('marketplace-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      const { error } = await supabase.from('marketplace_products').insert({
        user_id: user.id,
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price: parseFloat(formData.price),
        harvest_date: formData.harvestDate,
        expiry_date: formData.expiryDate,
        farm_name: formData.farmName,
        location: formData.location,
        category: formData.category,
        description: formData.description,
        image_url: imageUrl
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      onSuccess();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              className="w-full h-10 px-3 rounded-md border border-input"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="pieces">pieces</option>
              <option value="boxes">boxes</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="w-full h-10 px-3 rounded-md border border-input"
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="harvestDate">Harvest Date</Label>
          <Input
            id="harvestDate"
            type="date"
            required
            value={formData.harvestDate}
            onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="date"
            required
            value={formData.expiryDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="farmName">Farm Name</Label>
          <Input
            id="farmName"
            required
            value={formData.farmName}
            onChange={(e) => setFormData(prev => ({ ...prev, farmName: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            required
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="h-32"
        />
      </div>

      <div>
        <Label>Product Image</Label>
        <ImageUpload onImageSelect={handleImageSelect} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding Product..." : "Add Product"}
      </Button>
    </form>
  );
};

export default AddProductForm;
