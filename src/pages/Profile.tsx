
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, MapPin, Mail, Phone, Farm, Calendar, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    farmName: user?.farmName || 'Green Valley Farm',
    location: user?.location || 'Amritsar, Punjab',
    phone: '+91 7303231776',
    joinDate: 'April 2023'
  });
  
  // Sample data for profile sections
  const lendingItems = [
    { id: '1', name: 'Tractor', category: 'Equipment', borrower: 'Sharma Farms', dueDate: '2025-05-01', condition: 'Excellent' },
    { id: '2', name: 'Irrigation System', category: 'Equipment', borrower: 'Singh Orchards', dueDate: '2025-04-20', condition: 'Good' },
    { id: '3', name: 'Seed Drill', category: 'Tools', borrower: 'Kerala Agro', dueDate: '2025-04-25', condition: 'Fair' },
  ];
  
  const borrowingItems = [
    { id: '1', name: 'Harvester', category: 'Equipment', lender: 'Patel Farms', dueDate: '2025-04-15', lentSince: '2025-03-15' },
    { id: '2', name: 'Seed Spreader', category: 'Tools', lender: 'Tamil Greens', dueDate: '2025-04-25', lentSince: '2025-03-25' },
    { id: '3', name: 'Sprinkler System', category: 'Irrigation', lender: 'Kumar Agriculture', dueDate: '2025-05-05', lentSince: '2025-04-05' },
  ];
  
  const cropHistory = [
    { id: '1', crop: 'Rice', season: 'Kharif 2024', area: '5 acres', yield: '20 quintals/acre', notes: 'Good harvest despite erratic rainfall' },
    { id: '2', crop: 'Wheat', season: 'Rabi 2023-24', area: '7 acres', yield: '18 quintals/acre', notes: 'Used new drought-resistant variety' },
    { id: '3', crop: 'Cotton', season: 'Kharif 2023', area: '4 acres', yield: '8 quintals/acre', notes: 'Pest attack reduced overall yield' },
    { id: '4', crop: 'Pulses', season: 'Rabi 2022-23', area: '3 acres', yield: '10 quintals/acre', notes: 'Good quality product, sold above MSP' }
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8 pb-6 border-b">
        <div className="flex items-center">
          <div className="bg-farmlink-primary w-16 h-16 rounded-full flex items-center justify-center">
            <User className="text-white" size={28} />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl md:text-3xl font-bold text-farmlink-secondary">My Profile</h1>
            <p className="text-gray-600">Welcome, {user?.name || 'Farmer'}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-farmlink-primary text-white rounded-md hover:bg-farmlink-secondary transition-colors"
        >
          <Settings size={18} className="mr-2" />
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Farm Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Farmer Name</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Farm Name</label>
                  <Input 
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone</label>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-farmlink-primary text-white rounded-md hover:bg-farmlink-secondary transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <User size={20} className="text-farmlink-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-700">Farmer Name</h3>
                    <p>{formData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Farm size={20} className="text-farmlink-primary mt-1 mr-3" />
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
                    <h3 className="font-medium text-gray-700">Contact Email</h3>
                    <p>{user?.email || 'ritesh77@gmail.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone size={20} className="text-farmlink-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-700">Phone Number</h3>
                    <p>{formData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar size={20} className="text-farmlink-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-700">Member Since</h3>
                    <p>{formData.joinDate}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Farm Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Land Area</p>
                <p className="text-2xl font-bold">15 Acres</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Crops</p>
                <p className="text-2xl font-bold">3 varieties</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Equipment Owned</p>
                <p className="text-2xl font-bold">7 items</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Marketplace Rating</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold mr-1">4.8</p>
                  <div className="text-yellow-500 text-xl">★★★★★</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <Tabs defaultValue="lending">
          <TabsList className="mb-4">
            <TabsTrigger value="lending">Items I'm Lending</TabsTrigger>
            <TabsTrigger value="borrowing">Items I'm Borrowing</TabsTrigger>
            <TabsTrigger value="history">Crop History</TabsTrigger>
          </TabsList>

          <TabsContent value="lending">
            <Card>
              <CardContent className="pt-6">
                {lendingItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
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
                  <div className="text-center p-8">
                    <p className="text-gray-500">You aren't lending any items currently.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="borrowing">
            <Card>
              <CardContent className="pt-6">
                {borrowingItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Borrowed From</TableHead>
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
                  <div className="text-center p-8">
                    <p className="text-gray-500">You aren't borrowing any items currently.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Yield</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cropHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.crop}</TableCell>
                        <TableCell>{item.season}</TableCell>
                        <TableCell>{item.area}</TableCell>
                        <TableCell>{item.yield}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
