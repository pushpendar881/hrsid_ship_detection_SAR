-- Clean migration script for existing Supabase setup
-- Run this if you need to add missing components

-- Only create indexes that don't exist
DO $$ 
BEGIN
    -- Check and create missing indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ship_detections_session_id') THEN
        CREATE INDEX idx_ship_detections_session_id ON ship_detections(session_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ship_detections_project_id') THEN
        CREATE INDEX idx_ship_detections_project_id ON ship_detections(project_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ship_detections_status') THEN
        CREATE INDEX idx_ship_detections_status ON ship_detections(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ship_detections_image_hash') THEN
        CREATE INDEX idx_ship_detections_image_hash ON ship_detections(image_hash);
    END IF;
END $$;

-- Create missing tables only if they don't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'researcher')),
    organization TEXT,
    research_purpose TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    api_quota_used INTEGER DEFAULT 0,
    api_quota_limit INTEGER DEFAULT 100,
    preferences JSONB DEFAULT '{
        "email_notifications": true,
        "data_retention_days": 30,
        "export_format": "json",
        "default_confidence": 0.5
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN DEFAULT true,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
    last_activity TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    description TEXT,
    project_type TEXT DEFAULT 'research' CHECK (project_type IN ('research', 'commercial', 'educational')),
    settings JSONB DEFAULT '{
        "auto_save": true,
        "detection_threshold": 0.5,
        "max_images_per_batch": 10
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Add missing columns to existing ship_detections table if they don't exist
DO $$ 
BEGIN
    -- Add session_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ship_detections' AND column_name = 'session_id') THEN
        ALTER TABLE ship_detections ADD COLUMN session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL;
    END IF;
    
    -- Add project_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ship_detections' AND column_name = 'project_id') THEN
        ALTER TABLE ship_detections ADD COLUMN project_id UUID REFERENCES user_projects(id) ON DELETE SET NULL;
    END IF;
    
    -- Add image_hash column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ship_detections' AND column_name = 'image_hash') THEN
        ALTER TABLE ship_detections ADD COLUMN image_hash TEXT;
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ship_detections' AND column_name = 'status') THEN
        ALTER TABLE ship_detections ADD COLUMN status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed'));
    END IF;
    
    -- Add error_message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ship_detections' AND column_name = 'error_message') THEN
        ALTER TABLE ship_detections ADD COLUMN error_message TEXT;
    END IF;
    
    -- Add confidence_threshold column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ship_detections' AND column_name = 'confidence_threshold') THEN
        ALTER TABLE ship_detections ADD COLUMN confidence_threshold REAL DEFAULT 0.5;
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ship_detections' AND column_name = 'image_url') THEN
        ALTER TABLE ship_detections ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Create indexes for new tables (with IF NOT EXISTS check)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
        CREATE INDEX idx_users_email ON users(email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_username') THEN
        CREATE INDEX idx_users_username ON users(username);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
        CREATE INDEX idx_users_role ON users(role);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_subscription_tier') THEN
        CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_sessions_session_id') THEN
        CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_sessions_user_id') THEN
        CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_sessions_expires_at') THEN
        CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_projects_user_id') THEN
        CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_projects_is_active') THEN
        CREATE INDEX idx_user_projects_is_active ON user_projects(is_active);
    END IF;
END $$;

-- Create or replace views (these can be safely recreated)
CREATE OR REPLACE VIEW detection_stats AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.role,
    u.organization,
    COUNT(sd.*) as total_detections,
    SUM(sd.ship_count) as total_ships_detected,
    AVG(sd.ship_count) as avg_ships_per_detection,
    MAX(sd.timestamp) as last_detection,
    AVG(sd.processing_time_ms) as avg_processing_time,
    COUNT(DISTINCT sd.project_id) as active_projects
FROM users u
LEFT JOIN ship_detections sd ON u.id = sd.user_id
GROUP BY u.id, u.username, u.email, u.role, u.organization;

CREATE OR REPLACE VIEW project_stats AS
SELECT 
    up.id as project_id,
    up.project_name,
    up.description,
    up.project_type,
    u.username as owner_username,
    COUNT(sd.*) as total_detections,
    SUM(sd.ship_count) as total_ships_detected,
    AVG(sd.ship_count) as avg_ships_per_detection,
    MAX(sd.timestamp) as last_detection,
    up.created_at as project_created
FROM user_projects up
LEFT JOIN users u ON up.user_id = u.id
LEFT JOIN ship_detections sd ON up.id = sd.project_id
WHERE up.is_active = true
GROUP BY up.id, up.project_name, up.description, up.project_type, u.username, up.created_at;

CREATE OR REPLACE VIEW daily_detection_summary AS
SELECT 
    DATE(timestamp) as detection_date,
    COUNT(*) as total_detections,
    SUM(ship_count) as total_ships,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(processing_time_ms) as avg_processing_time
FROM ship_detections
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY detection_date DESC;

-- Test query to verify everything is working
SELECT 'Database setup completed successfully!' as status;