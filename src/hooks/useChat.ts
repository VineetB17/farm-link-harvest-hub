
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
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const sendMessage = async (message: string) => {
    if (!user?.id || !selectedUserId || !message.trim()) return;

    const newMessage = {
      sender_id: user.id,
      receiver_id: selectedUserId,
      message: message.trim(),
    };

    const { error } = await supabase
      .from('chats')
      .insert([newMessage]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `receiver_id=eq.${user?.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only add message if it's related to the current chat
          if (newMessage.sender_id === selectedUserId || newMessage.receiver_id === selectedUserId) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUserId, user?.id]);

  return {
    messages,
    loading,
    sendMessage,
  };
};
