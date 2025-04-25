
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
        console.log("Fetching notifications for user:", user?.id);
        
        // Add auth header explicitly to make sure it's present
        const { data, error, status } = await supabase.functions.invoke('get_notifications', {
          headers: {
            Authorization: `Bearer ${supabase.auth.session()?.access_token}`
          }
        });
        
        console.log("Edge function response status:", status);
        
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(`Error from edge function: ${error.message || JSON.stringify(error)}`);
        }
        
        console.log("Notifications data received:", data);
        return data as Notification[] || [];
      } catch (error: any) {
        console.error('Error fetching notifications:', error);
        toast({
          title: "Error fetching notifications",
          description: error.message || "Unknown error occurred",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!user && !!supabase.auth.session()?.access_token
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        console.log("Marking notification as read:", notificationId);
        
        // Add auth header explicitly to make sure it's present
        const { error, status } = await supabase.functions.invoke('mark_notification_read', {
          body: { notification_id: notificationId },
          headers: {
            Authorization: `Bearer ${supabase.auth.session()?.access_token}`
          }
        });
        
        console.log("Edge function response status:", status);
        
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(`Error from edge function: ${error.message || JSON.stringify(error)}`);
        }
      } catch (error: any) {
        console.error('Error marking notification as read:', error);
        toast({
          title: "Error marking notification as read",
          description: error.message || "Unknown error occurred",
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
