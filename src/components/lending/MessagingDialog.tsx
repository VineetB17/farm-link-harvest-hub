
import React from 'react';
import { BorrowRequest } from '@/types/equipment';
import ChatDialog from './ChatDialog';

interface MessagingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  borrowRequest: BorrowRequest | null;
}

const MessagingDialog: React.FC<MessagingDialogProps> = ({
  isOpen,
  onClose,
  borrowRequest
}) => {
  if (!borrowRequest) return null;

  return (
    <ChatDialog
      isOpen={isOpen}
      onClose={onClose}
      recipientId={borrowRequest.borrower_id}
      recipientName={borrowRequest.borrower_name}
      requestId={borrowRequest.id}
    />
  );
};

export default MessagingDialog;
