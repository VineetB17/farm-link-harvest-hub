
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Equipment, BorrowRequest } from '@/types/equipment';
import EquipmentList from './EquipmentList';
import BorrowedEquipmentList from './BorrowedEquipmentList';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, MessageCircle } from "lucide-react";
import BorrowRequestCard from './BorrowRequestCard';

interface LendingTabsProps {
  equipment: Equipment[];
  loading: boolean;
  myBorrowings: Equipment[];
  requestedItems: Equipment[];
  myListedItems: Equipment[];
  borrowRequests: BorrowRequest[];
  onBorrowClick: (equipment: Equipment) => void;
  onReturnEquipment: (id: string) => void;
  onDeleteListing: (id: string) => void;
  onMessageRequest: (request: BorrowRequest) => void;
  onAcceptRequest: (request: BorrowRequest) => void;
  onDeclineRequest: (request: BorrowRequest) => void;
}

const LendingTabs: React.FC<LendingTabsProps> = ({
  equipment,
  loading,
  myBorrowings,
  requestedItems,
  myListedItems,
  borrowRequests,
  onBorrowClick,
  onReturnEquipment,
  onDeleteListing,
  onMessageRequest,
  onAcceptRequest,
  onDeclineRequest
}) => {
  return (
    <Tabs defaultValue="available">
      <TabsList>
        <TabsTrigger value="available">Available ({equipment.filter(e => e.available).length})</TabsTrigger>
        <TabsTrigger value="borrowed">Borrowed ({myBorrowings.length})</TabsTrigger>
        <TabsTrigger value="requested">Requested ({requestedItems.length})</TabsTrigger>
        <TabsTrigger value="myListings">My Listings ({myListedItems.length})</TabsTrigger>
        <TabsTrigger value="borrowRequests">
          Requests 
          {borrowRequests.length > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{borrowRequests.length}</span>
          )}
        </TabsTrigger>
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
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDeleteListing(item.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
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
      
      <TabsContent value="borrowRequests">
        <div className="mt-4">
          {borrowRequests.length > 0 ? (
            <div className="space-y-4">
              {borrowRequests.map((request) => (
                <BorrowRequestCard
                  key={request.id}
                  request={request}
                  onMessage={() => onMessageRequest(request)}
                  onAccept={() => onAcceptRequest(request)}
                  onDecline={() => onDeclineRequest(request)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">You don't have any equipment requests.</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default LendingTabs;
