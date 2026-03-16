-- Fresh Supabase setup for Ship Detection System
-- Run this script in Supabase SQL Editor

-- Enable Row Level Security extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table first (referenced by other tables)
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

-- Create user_sessions table
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

-- Create user_projects table
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

-- Create ship_detections table (main table)
CREATE TABLE IF NOT EXISTS ship_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    project_id UUID REFERENCES user_projects(id) ON DELETE SET NULL,
    image_name TEXT,
    image_url TEXT,
    image_hash TEXT,
    ship_count INTEGER DEFAULT 0,
    confidence_scores JSONB DEFAULT '[]'::jsonb,
    bounding_boxes JSONB DEFAULT '[]'::jsonb,
    detection_metadata JSONB DEFAULT '{
        "model": "faster_rcnn_r50_fpn",
        "dataset": "hrsid",
        "version": "1.0",
        "image_size": null,
        "processing_location": "hf_spaces"
    }'::jsonb,
    processing_time_ms INTEGER,
    confidence_threshold REAL DEFAULT 0.5,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes after tables exist
CREATE INDEX IF NOT EXISTS idx_ship_detections_user_id ON ship_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_ship_detections_session_id ON ship_detections(session_id);
CREATE INDEX IF NOT EXISTS idx_ship_detections_project_id ON ship_detections(project_id);
CREATE INDEX IF NOT EXISTS idx_ship_detections_timestamp ON ship_detections(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ship_detections_ship_count ON ship_detections(ship_count);
CREATE INDEX IF NOT EXISTS idx_ship_detections_status ON ship_detections(status);
CREATE INDEX IF NOT EXISTS idx_ship_detections_image_hash ON ship_detections(image_hash);

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- Session table indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Project table indexes
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_is_active ON user_projects(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_ship_detections_updated_at ON ship_detections;
CREATE TRIGGER update_ship_detections_updated_at 
    BEFORE UPDATE ON ship_detections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_projects_updated_at ON user_projects;
CREATE TRIGGER update_user_projects_updated_at 
    BEFORE UPDATE ON user_projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE ship_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, restrict later)
DROP POLICY IF EXISTS "Allow all operations for now" ON ship_detections;
CREATE POLICY "Allow all operations for now" ON ship_detections
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations for now" ON users;
CREATE POLICY "Allow all operations for now" ON users
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations for now" ON user_sessions;
CREATE POLICY "Allow all operations for now" ON user_sessions
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations for now" ON user_projects;
CREATE POLICY "Allow all operations for now" ON user_projects
    FOR ALL USING (true);

-- Create views for analytics
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

-- Insert a test record to verify everything works
INSERT INTO ship_detections (user_id, ship_count, confidence_scores, bounding_boxes) 
VALUES (
    null, 
    2, 
    '[0.95, 0.87]'::jsonb, 
    '[[100, 150, 200, 250], [300, 100, 400, 200]]'::jsonb
);

-- Test query
SELECT 'Database setup completed successfully! Test record inserted.' as status,
       COUNT(*) as total_records 
FROM ship_detections;