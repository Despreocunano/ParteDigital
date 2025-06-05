-- First drop the existing function
DROP FUNCTION IF EXISTS delete_user_data(uuid);

-- Then create the new function
CREATE FUNCTION delete_user_data(p_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Delete song recommendations first (they reference attendees)
  DELETE FROM song_recommendations 
  WHERE attendee_id IN (
    SELECT id FROM attendees WHERE user_id = p_user_id
  );
  
  -- Delete email logs
  DELETE FROM email_logs WHERE user_id = p_user_id;
  
  -- Delete attendees
  DELETE FROM attendees WHERE user_id = p_user_id;
  
  -- Delete tables
  DELETE FROM tables WHERE user_id = p_user_id;
  
  -- Delete landing pages
  DELETE FROM landing_pages WHERE user_id = p_user_id;
  
  -- Delete storage objects
  DELETE FROM storage.objects 
  WHERE bucket_id IN ('landing-images', 'landing-music')
  AND split_part(name, '/', 1) = p_user_id::text;
  
  -- Delete user profile last
  DELETE FROM users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION delete_user_data IS 'Deletes all data associated with a user';