
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

interface ChatUser {
  id: string;
  name?: string;
  farmName?: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `receiver_id=eq.${user?.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUsers = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, farm_name')
      .neq('id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
      return;
    }

    setUsers(data);
  };

  const fetchMessages = async (receiverId: string) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
      return;
    }

    setMessages(data);
    setTimeout(scrollToBottom, 100);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedUser || !newMessage.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('chats').insert({
      sender_id: user.id,
      receiver_id: selectedUser.id,
      message: newMessage.trim(),
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } else {
      setNewMessage('');
    }
    setLoading(false);
  };

  return (
    <div className="farmlink-container py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Users list */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Farmers</h2>
          <ScrollArea className="h-[500px]">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setSelectedUser(u);
                  fetchMessages(u.id);
                }}
                className={`w-full text-left p-3 rounded-md mb-2 hover:bg-gray-100 ${
                  selectedUser?.id === u.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="font-medium">{u.name || 'Unnamed Farmer'}</div>
                {u.farmName && (
                  <div className="text-sm text-gray-500">{u.farmName}</div>
                )}
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="md:col-span-3 bg-white rounded-lg shadow h-[600px] flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b">
                <h2 className="font-semibold">
                  {selectedUser.name || 'Unnamed Farmer'}
                  {selectedUser.farmName && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({selectedUser.farmName})
                    </span>
                  )}
                </h2>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-farmlink-primary text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p>{message.message}</p>
                        <span className="text-xs opacity-75">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message input */}
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
