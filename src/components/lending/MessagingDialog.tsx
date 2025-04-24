
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BorrowRequest, LendingMessage } from '@/types/equipment';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, User } from 'lucide-react';

interface MessagingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  borrowRequest: BorrowRequest | null;
  onSendMessage: (message: string) => Promise<void>;
  messages: LendingMessage[];
}

const MessagingDialog: React.FC<MessagingDialogProps> = ({
  isOpen,
  onClose,
  borrowRequest,
  onSendMessage,
  messages
}) => {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
      ' ' + date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare size={18} />
            Conversation with {borrowRequest?.borrower_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden flex flex-col h-[400px]">
          <ScrollArea className="flex-grow p-4 bg-gray-50 rounded-md">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No messages yet. Start the conversation!</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-3 rounded-lg max-w-[80%] ${
                      msg.sender_id === user?.id 
                        ? 'bg-farmlink-primary text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p>{msg.message}</p>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{msg.sender_name}</span>
                      <span className="mx-1">•</span>
                      <span>{formatTimestamp(msg.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="mt-4 flex gap-2">
            <Textarea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingDialog;
