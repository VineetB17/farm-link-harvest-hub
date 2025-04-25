
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
        
        // Get current session token
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        
        if (!accessToken) {
          console.error("No access token available");
          throw new Error("Authentication required");
        }
        
        // Invoke edge function with the access token
        const { data, error } = await supabase.functions.invoke('get_notifications', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
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
    enabled: !!user
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        console.log("Marking notification as read:", notificationId);
        
        // Get current session token
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        
        if (!accessToken) {
          console.error("No access token available");
          throw new Error("Authentication required");
        }
        
        // Invoke edge function with the access token
        const { error } = await supabase.functions.invoke('mark_notification_read', {
          body: { notification_id: notificationId },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
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
