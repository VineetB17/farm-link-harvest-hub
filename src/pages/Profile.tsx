
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, MapPin, Mail, Phone, Building2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    farmName: user?.farmName || '',
    location: user?.location || '',
    phone: user?.phone || '',
    email: user?.email || '',
    website: user?.website || '',
  });
  
  const lendingItems = [
    { id: '1', name: 'Tractor', category: 'Equipment', borrower: 'Green Valley Farms', dueDate: '2025-05-01', condition: 'Excellent' },
    { id: '2', name: 'Irrigation System', category: 'Equipment', borrower: 'Mountain View Farm', dueDate: '2025-04-20', condition: 'Good' },
    { id: '3', name: 'Seed Drill', category: 'Tools', borrower: 'Sunrise Agriculture', dueDate: '2025-04-25', condition: 'Fair' },
  ];
  
  const borrowingItems = [
    { id: '1', name: 'Harvester', category: 'Equipment', lender: 'Valley Farm Co.', dueDate: '2025-04-15', lentSince: '2025-03-15' },
    { id: '2', name: 'Seed Spreader', category: 'Tools', lender: 'Green Fields Ltd', dueDate: '2025-04-25', lentSince: '2025-03-25' },
    { id: '3', name: 'Sprinkler System', category: 'Irrigation', lender: 'Farm Tech Solutions', dueDate: '2025-05-05', lentSince: '2025-04-05' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated",
    });
  };

  return (
    <div className="farmlink-container py-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
        <div className="flex items-center">
          <div className="bg-farmlink-primary w-16 h-16 rounded-full flex items-center justify-center">
            <User className="text-white" size={28} />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl md:text-3xl font-bold text-farmlink-secondary">My Profile</h1>
            <p className="text-gray-600">Welcome, {formData.name}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-farmlink-primary text-white rounded-md hover:bg-farmlink-secondary transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Farm Name</label>
                  <Input name="farmName" value={formData.farmName} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input name="location" value={formData.location} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input name="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <Input name="website" value={formData.website} onChange={handleInputChange} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <User size={20} className="text-farmlink-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-700">Full Name</h3>
                    <p>{formData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Building2 size={20} className="text-farmlink-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-700">Farm Name</h3>
                    <p>{formData.farmName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={20} className="text-farmlink-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-700">Location</h3>
                    <p>{formData.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail size={20} className="text-farmlink-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-700">Email</h3>
                    <p>{formData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone size={20} className="text-farmlink-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-700">Phone</h3>
                    <p>{formData.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Equipment I'm Lending</CardTitle>
          </CardHeader>
          <CardContent>
            {lendingItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Borrowed By</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lendingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.borrower}</TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                      <TableCell>{item.condition}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">You aren't lending any equipment currently.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Equipment I'm Borrowing</CardTitle>
          </CardHeader>
          <CardContent>
            {borrowingItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead>Since</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.lender}</TableCell>
                      <TableCell>{item.lentSince}</TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">You aren't borrowing any equipment currently.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
