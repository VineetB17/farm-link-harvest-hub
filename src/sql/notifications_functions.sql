
-- Function to get all notifications for current user
CREATE OR REPLACE FUNCTION public.get_notifications()
RETURNS SETOF json 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT json_build_object(
        'id', n.id,
        'title', n.title,
        'message', n.message,
        'read', n.read,
        'created_at', n.created_at,
        'type', n.type,
        'item_id', n.item_id,
        'expiry_date', n.expiry_date
    )
    FROM public.notifications n
    WHERE n.user_id = auth.uid()
    ORDER BY n.created_at DESC;
END;
$$;

-- Function to mark a notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.notifications
    SET read = true
    WHERE id = notification_id AND user_id = auth.uid();
END;
$$;
