
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare, UserRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import UserSearchInput from '@/components/UserSearchInput';

interface ChatUser {
  id: string;
  name?: string;
  farmName?: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const { messages, sendMessage, loading } = useChat(selectedUser?.id || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  if (!user) {
    return (
      <div className="farmlink-container py-8">
        <div className="text-center">Please log in to use the chat feature.</div>
      </div>
    );
  }

  return (
    <div className="farmlink-container py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Users search and list */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <UserRound size={18} />
            Search Users
          </h2>
          <UserSearchInput 
            onSelectUser={setSelectedUser}
            currentUserId={user.id}
          />

          {selectedUser && (
            <div className="mt-4 p-2 bg-gray-50 rounded-md">
              <div className="font-medium">Selected User:</div>
              <div>{selectedUser.name}</div>
              {selectedUser.farmName && (
                <div className="text-sm text-gray-500">{selectedUser.farmName}</div>
              )}
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="md:col-span-3 bg-white rounded-lg shadow h-[600px] flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b">
                <h2 className="font-semibold">
                  {selectedUser.name}
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
                  {loading ? (
                    <div className="text-center text-gray-500">Loading messages...</div>
                  ) : messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user.id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender_id === user.id
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
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-60 text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="mx-auto h-12 w-12 opacity-30" />
                        <p className="mt-2">No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message input */}
              <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageSquare className="mx-auto h-16 w-16 opacity-30" />
                <p className="mt-4">Search and select a user to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
