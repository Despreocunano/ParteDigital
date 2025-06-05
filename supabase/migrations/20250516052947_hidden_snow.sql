CREATE OR REPLACE FUNCTION delete_user_data(user_id uuid)
RETURNS void AS $$
BEGIN
  -- Delete landing pages
  DELETE FROM landing_pages WHERE user_id = $1;
  
  -- Delete attendees and their song recommendations
  DELETE FROM song_recommendations 
  WHERE attendee_id IN (
    SELECT id FROM attendees WHERE user_id = $1
  );
  
  -- Delete attendees
  DELETE FROM attendees WHERE user_id = $1;
  
  -- Delete tables
  DELETE FROM tables WHERE user_id = $1;
  
  -- Delete email logs
  DELETE FROM email_logs WHERE user_id = $1;
  
  -- Delete user profile
  DELETE FROM users WHERE id = $1;
  
  -- Delete storage objects
  DELETE FROM storage.objects 
  WHERE bucket_id IN ('landing-images', 'landing-music')
  AND split_part(name, '/', 1) = $1::text;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION delete_user_data IS 'Deletes all data associated with a user';