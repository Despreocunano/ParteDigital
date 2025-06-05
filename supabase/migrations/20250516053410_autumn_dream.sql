-- Drop existing function first
DROP FUNCTION IF EXISTS delete_user_data(uuid);

-- Create the new function with a properly scoped parameter name
CREATE OR REPLACE FUNCTION delete_user_data(target_user_id uuid)
RETURNS void AS $$
DECLARE
  attendee_ids uuid[];
BEGIN
  -- Get attendee IDs first to avoid ambiguous column references
  SELECT ARRAY_AGG(id) INTO attendee_ids
  FROM attendees 
  WHERE user_id = target_user_id;

  -- Delete song recommendations using the collected attendee IDs
  IF attendee_ids IS NOT NULL THEN
    DELETE FROM song_recommendations 
    WHERE attendee_id = ANY(attendee_ids);
  END IF;
  
  -- Delete email logs
  DELETE FROM email_logs WHERE user_id = target_user_id;
  
  -- Delete attendees
  DELETE FROM attendees WHERE user_id = target_user_id;
  
  -- Delete tables
  DELETE FROM tables WHERE user_id = target_user_id;
  
  -- Delete landing pages
  DELETE FROM landing_pages WHERE user_id = target_user_id;
  
  -- Delete storage objects
  DELETE FROM storage.objects 
  WHERE bucket_id IN ('landing-images', 'landing-music')
  AND split_part(name, '/', 1) = target_user_id::text;
  
  -- Delete user profile last
  DELETE FROM users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION delete_user_data IS 'Deletes all data associated with a user';