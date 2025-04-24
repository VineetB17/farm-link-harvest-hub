
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LendingMessage } from '@/types/equipment';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  requestId: string;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  requestId
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<LendingMessage[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && requestId) {
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [isOpen, requestId]);

  const fetchMessages = async () => {
    if (!requestId) return;

    const { data, error } = await supabase
      .from('lending_messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('chat-updates')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lending_messages',
          filter: `request_id=eq.${requestId}`
        },
        (payload) => {
          const newMessage = payload.new as LendingMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim() || !requestId) return;

    try {
      const { error } = await supabase
        .from('lending_messages')
        .insert([{
          request_id: requestId,
          sender_id: user.id,
          sender_name: user.name || user.email,
          message: newMessage.trim()
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare size={18} />
            Chat with {recipientName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-grow p-4 bg-gray-50 rounded-lg h-[400px]">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender_id === user?.id
                    ? 'bg-farmlink-primary text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  <p>{msg.message}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <User size={12} />
                  <span>{msg.sender_name}</span>
                  <span>•</span>
                  <span>{formatTimestamp(msg.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
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
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
