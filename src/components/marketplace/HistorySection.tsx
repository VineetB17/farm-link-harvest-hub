
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryItem {
  id: string;
  product_name: string;
  buyer_name: string;
  offer_amount: number;
  status: string;
  action_date: string;
  message?: string;
  seller_id: string;
  buyer_id: string;
}

interface HistorySectionProps {
  history: HistoryItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
  const { user } = useAuth();

  // Filter history to show both where user is seller or buyer
  const userHistory = history.filter(item => 
    item.seller_id === user?.id || item.buyer_id === user?.id
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketplace History</CardTitle>
      </CardHeader>
      <CardContent>
        {userHistory.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Other Party</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userHistory.map((item) => {
                  const isUserBuyer = item.buyer_id === user?.id;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{format(new Date(item.action_date), 'PPp')}</TableCell>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{isUserBuyer ? 'Buyer' : 'Seller'}</TableCell>
                      <TableCell>{isUserBuyer ? 'Seller' : item.buyer_name}</TableCell>
                      <TableCell>₹{item.offer_amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          item.status === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>{item.message || 'No message'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No marketplace history available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistorySection;
