
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserSearch } from 'lucide-react';

interface UserSearchInputProps {
  onSelectUser: (user: { id: string; name: string; farmName?: string }) => void;
  currentUserId: string;
}

const UserSearchInput = ({ onSelectUser, currentUserId }: UserSearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        // Query the profiles table for users that match the search query
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, farm_name')
          .neq('id', currentUserId)
          .ilike('name', `%${searchQuery}%`)
          .limit(10);

        if (error) throw error;
        
        console.log('Search results:', data);
        setSearchResults(data || []);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    // Add a debounce to prevent too many requests
    const debounceTimeout = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, currentUserId]);

  return (
    <div className="relative">
      <div className="relative">
        <UserSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {searchResults.length > 0 && (
        <ScrollArea className="absolute z-10 mt-1 max-h-60 w-full rounded-md border bg-white shadow-lg">
          {searchResults.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                console.log('Selected user:', user);
                onSelectUser({
                  id: user.id,
                  name: user.name,
                  farmName: user.farm_name
                });
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              <div className="font-medium">{user.name}</div>
              {user.farm_name && (
                <div className="text-sm text-gray-500">{user.farm_name}</div>
              )}
            </button>
          ))}
        </ScrollArea>
      )}

      {loading && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white p-4 shadow-lg">
          Searching...
        </div>
      )}
      
      {searchQuery && searchResults.length === 0 && !loading && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white p-4 shadow-lg">
          No users found
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;
