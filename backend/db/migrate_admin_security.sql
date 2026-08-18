-- Migration script to add email verification and password reset audit fields to admin_users table

ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP,
ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create function to auto-update updated_at on modify if it doesn't exist
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_admin_users_modtime ON admin_users;
CREATE TRIGGER update_admin_users_modtime
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
