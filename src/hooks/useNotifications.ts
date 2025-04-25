
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
      try {
        // Using a direct fetch to the edge function
        const { data, error } = await supabase.functions.invoke('get_notifications');
        
        if (error) {
          throw error;
        }
        
        return data as Notification[] || [];
      } catch (error: any) {
        toast({
          title: "Error fetching notifications",
          description: error.message,
          variant: "destructive"
        });
        console.error('Error fetching notifications:', error);
        return [];
      }
    },
    enabled: !!user
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const { error } = await supabase.functions.invoke('mark_notification_read', {
          body: { notification_id: notificationId }
        });
        
        if (error) {
          throw error;
        }
      } catch (error: any) {
        toast({
          title: "Error marking notification as read",
          description: error.message,
          variant: "destructive"
        });
        console.error('Error marking notification as read:', error);
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
