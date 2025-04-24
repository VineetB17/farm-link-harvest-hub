
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

export const useChat = (selectedUserId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!user?.id || !selectedUserId) return;
    
    setLoading(true);
    try {
      console.log('Fetching messages between:', user.id, 'and', selectedUserId);
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } else {
        console.log('Fetched messages:', data);
        setMessages(data || []);
      }
    } catch (error) {
      console.error("Error in fetchMessages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!user?.id || !selectedUserId || !message.trim()) {
      console.error("Cannot send message: missing user ID, selected user ID, or message");
      return;
    }

    console.log('Sending message to:', selectedUserId);
    const newMessage = {
      sender_id: user.id,
      receiver_id: selectedUserId,
      message: message.trim(),
    };

    const { error, data } = await supabase
      .from('chats')
      .insert([newMessage])
      .select();

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      // Add the new message to the messages state
      setMessages(prev => [...prev, data[0]]);
      console.log('Message sent successfully:', data[0]);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      console.log('Selected user changed, fetching messages with:', selectedUserId);
      fetchMessages();
      
      // Set up realtime subscription for new messages
      const channel = supabase
        .channel('chat_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chats',
          },
          (payload) => {
            const newMessage = payload.new as Message;
            // Only add message if it's related to the current chat
            if (
              (newMessage.sender_id === user?.id && newMessage.receiver_id === selectedUserId) ||
              (newMessage.sender_id === selectedUserId && newMessage.receiver_id === user?.id)
            ) {
              console.log('New message received via realtime:', newMessage);
              setMessages(prev => [...prev, newMessage]);
            }
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channel);
      };
    }
  }, [selectedUserId, user?.id]);

  return {
    messages,
    loading,
    sendMessage,
  };
};
