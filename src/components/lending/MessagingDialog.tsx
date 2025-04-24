
import React from 'react';
import { BorrowRequest, LendingMessage } from '@/types/equipment';
import ChatDialog from './ChatDialog';

interface MessagingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  borrowRequest: BorrowRequest | null;
  onSendMessage?: (message: string) => Promise<void>;
  messages?: LendingMessage[];
}

const MessagingDialog: React.FC<MessagingDialogProps> = ({
  isOpen,
  onClose,
  borrowRequest,
  onSendMessage,
  messages = []
}) => {
  if (!borrowRequest) return null;

  return (
    <ChatDialog
      isOpen={isOpen}
      onClose={onClose}
      recipientId={borrowRequest.borrower_id}
      recipientName={borrowRequest.borrower_name}
      requestId={borrowRequest.id}
      externalMessages={messages}
      onSendMessage={onSendMessage}
    />
  );
};

export default MessagingDialog;
