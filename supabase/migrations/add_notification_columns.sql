-- Add notification columns to profiles table if they don't exist
-- This migration adds the columns needed for notification preferences

-- Add notifications_enabled column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'notifications_enabled'
  ) THEN
    ALTER TABLE profiles ADD COLUMN notifications_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add notification_time column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'notification_time'
  ) THEN
    ALTER TABLE profiles ADD COLUMN notification_time TIME DEFAULT '09:00';
  END IF;
END $$;

-- Update existing rows to have default values
UPDATE profiles 
SET 
  notifications_enabled = COALESCE(notifications_enabled, true),
  notification_time = COALESCE(notification_time, '09:00')
WHERE notifications_enabled IS NULL OR notification_time IS NULL;
