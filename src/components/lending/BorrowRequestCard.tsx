
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BorrowRequest } from '@/types/equipment';
import { MessageCircle, CheckCircle, XCircle } from 'lucide-react';

interface BorrowRequestCardProps {
  request: BorrowRequest;
  onMessage: (request: BorrowRequest) => void;
  onAccept: (request: BorrowRequest) => void;
  onDecline: (request: BorrowRequest) => void;
}

const BorrowRequestCard: React.FC<BorrowRequestCardProps> = ({ 
  request, 
  onMessage, 
  onAccept,
  onDecline
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg mb-2">{request.borrower_name} wants to borrow</h3>
        <div className="text-sm text-gray-500 mb-2">
          From {new Date(request.start_date).toLocaleDateString()} to {new Date(request.end_date).toLocaleDateString()}
        </div>
        {request.message && (
          <div className="bg-gray-50 p-3 rounded-md mb-3 border border-gray-100">
            <p className="text-gray-700 italic">{request.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onMessage(request)}
          className="flex items-center gap-1"
        >
          <MessageCircle size={16} />
          Message
        </Button>
        {request.status === "pending" && (
          <>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onAccept(request)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle size={16} />
              Accept
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDecline(request)}
              className="flex items-center gap-1"
            >
              <XCircle size={16} />
              Decline
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BorrowRequestCard;
