
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type: string;
  item_id: string;
  expiry_date: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Using a raw query with RPC call to work around TypeScript issues
      const { data, error } = await supabase.rpc('get_notifications');

      if (error) {
        toast({
          title: "Error fetching notifications",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      return (data || []) as Notification[];
    },
    enabled: !!user
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      // Using a raw query with RPC call to work around TypeScript issues
      const { error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId
      });

      if (error) {
        toast({
          title: "Error marking notification as read",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead
  };
}
