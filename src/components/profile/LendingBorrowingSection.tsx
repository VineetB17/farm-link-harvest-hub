
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LendingItem {
  id: string;
  name: string;
  category: string;
  borrower: string;
  dueDate: string;
  condition: string;
}

interface BorrowingItem {
  id: string;
  name: string;
  category: string;
  lender: string;
  dueDate: string;
  lentSince: string;
}

interface LendingBorrowingSectionProps {
  lendingItems: LendingItem[];
  borrowingItems: BorrowingItem[];
}

const LendingBorrowingSection: React.FC<LendingBorrowingSectionProps> = ({ 
  lendingItems, 
  borrowingItems 
}) => {
  return (
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
  );
};

export default LendingBorrowingSection;
