
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface MarketplaceRequest {
  id: string;
  product_id: string;
  marketplace_products: {
    name: string;
    user_id: string;
  };
  borrower_name: string;
  offer_amount: number;
  message: string;
  status: string;
}

interface RequestsSectionProps {
  requests: MarketplaceRequest[];
  onAccept: (requestId: string, productId: string) => void;
  onReject: (requestId: string) => void;
}

const RequestsSection: React.FC<RequestsSectionProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Offer Amount</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.marketplace_products?.name || "Unknown Product"}
                    </TableCell>
                    <TableCell>{request.borrower_name}</TableCell>
                    <TableCell>₹{request.offer_amount}</TableCell>
                    <TableCell>{request.message || "No message"}</TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                        onClick={() => onAccept(request.id, request.product_id)}
                      >
                        <Check size={16} className="mr-1" /> Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                        onClick={() => onReject(request.id)}
                      >
                        <X size={16} className="mr-1" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No pending requests for your products
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestsSection;
