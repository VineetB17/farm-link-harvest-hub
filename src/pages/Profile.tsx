
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  // Sample data - in a real app, these would come from API calls
  const lendingItems = [
    { id: '1', name: 'Tractor', category: 'Equipment', borrower: 'Green Valley Farm', dueDate: '2025-05-01' },
    { id: '2', name: 'Irrigation System', category: 'Equipment', borrower: 'Sunny Hill Orchards', dueDate: '2025-04-20' },
  ];
  
  const borrowingItems = [
    { id: '1', name: 'Harvester', category: 'Equipment', lender: 'Mountain View Farm', dueDate: '2025-04-15' },
    { id: '2', name: 'Seed Spreader', category: 'Tools', lender: 'River Valley Greens', dueDate: '2025-04-25' },
  ];

  return (
    <div className="farmlink-container py-10">
      <div className="flex items-center mb-8 pb-6 border-b">
        <div className="bg-farmlink-primary w-16 h-16 rounded-full flex items-center justify-center">
          <User className="text-white" size={28} />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl md:text-3xl font-bold text-farmlink-secondary">My Profile</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Farmer'}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Farm Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-gray-700">Farm Name</h3>
            <p>{user?.farmName || 'Green Valley Farm'}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-gray-700">Location</h3>
            <p>{user?.location || 'Portland, OR'}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-gray-700">Contact Email</h3>
            <p>{user?.email || 'farmer@example.com'}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-gray-700">Member Since</h3>
            <p>April 2025</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Equipment Sharing</h2>
        <Tabs defaultValue="lending">
          <TabsList className="mb-4">
            <TabsTrigger value="lending">Items I'm Lending</TabsTrigger>
            <TabsTrigger value="borrowing">Items I'm Borrowing</TabsTrigger>
          </TabsList>

          <TabsContent value="lending">
            <div className="bg-white rounded-md shadow overflow-hidden">
              {lendingItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Borrowed By</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lendingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.borrower}</TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-500">You aren't lending any items currently.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="borrowing">
            <div className="bg-white rounded-md shadow overflow-hidden">
              {borrowingItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Borrowed From</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.lender}</TableCell>
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
