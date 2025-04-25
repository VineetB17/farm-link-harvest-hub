import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Equipment, BorrowRequest } from '@/types/equipment';
import EquipmentList from './EquipmentList';
import BorrowedEquipmentList from './BorrowedEquipmentList';
import EditEquipmentForm from './EditEquipmentForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Check, X, Pencil } from "lucide-react";

interface LendingTabsProps {
  equipment: Equipment[];
  loading: boolean;
  myBorrowings: Equipment[];
  requestedItems: Equipment[];
  myListedItems: Equipment[];
  incomingRequests: BorrowRequest[];
  onBorrowClick: (equipment: Equipment) => void;
  onReturnEquipment: (id: string) => void;
  onDeleteListing: (id: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onEditEquipment: (equipment: Partial<Equipment>) => void;
  categories: string[];
}

const LendingTabs: React.FC<LendingTabsProps> = ({
  equipment,
  loading,
  myBorrowings,
  requestedItems,
  myListedItems,
  incomingRequests,
  onBorrowClick,
  onReturnEquipment,
  onDeleteListing,
  onAcceptRequest,
  onDeclineRequest,
  onEditEquipment,
  categories
}) => {
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  return (
    <Tabs defaultValue="available">
      <TabsList>
        <TabsTrigger value="available">Available ({equipment.filter(e => e.available).length})</TabsTrigger>
        <TabsTrigger value="borrowed">Borrowed ({myBorrowings.length})</TabsTrigger>
        <TabsTrigger value="requested">Requested ({requestedItems.length})</TabsTrigger>
        <TabsTrigger value="myListings">My Listings ({myListedItems.length})</TabsTrigger>
        <TabsTrigger value="requests">Requests ({incomingRequests.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="available">
        <EquipmentList 
          items={equipment.filter(e => e.available)} 
          isLoading={loading}
          onBorrowClick={onBorrowClick}
        />
      </TabsContent>

      <TabsContent value="borrowed">
        <BorrowedEquipmentList 
          items={myBorrowings}
          onReturn={onReturnEquipment}
        />
      </TabsContent>
      
      <TabsContent value="requested">
        <EquipmentList 
          items={requestedItems}
          isLoading={false}
          emptyMessage="You haven't requested any equipment yet."
        />
      </TabsContent>

      <TabsContent value="myListings">
        {editingEquipment && (
          <div className="mb-6">
            <EditEquipmentForm
              equipment={editingEquipment}
              onSubmit={(data) => {
                onEditEquipment(data);
                setEditingEquipment(null);
              }}
              onClose={() => setEditingEquipment(null)}
              categories={categories}
            />
          </div>
        )}

        {myListedItems.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myListedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'borrowed' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingEquipment(item)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDeleteListing(item.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">You haven't listed any equipment yet.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="requests">
        {incomingRequests.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.equipment_listings ? request.equipment_listings.name : "Unknown Equipment"}
                    </TableCell>
                    <TableCell>{request.borrower_name}</TableCell>
                    <TableCell>
                      {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{request.message || "No message"}</TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                        onClick={() => onAcceptRequest(request.id)}
                      >
                        <Check size={16} className="mr-1" /> Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                        onClick={() => onDeclineRequest(request.id)}
                      >
                        <X size={16} className="mr-1" /> Decline
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No pending requests for your equipment.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default LendingTabs;
