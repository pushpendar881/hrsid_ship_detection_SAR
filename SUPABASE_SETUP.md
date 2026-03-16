# Supabase Setup Guide for Ship Detection System

## Step 1: Create Supabase Project

1. **Go to https://supabase.com**
2. **Sign up/Login** with GitHub
3. **Create New Project**
   - Name: `hrsid-ship-detection`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users

## Step 2: Database Schema Setup

### Run this SQL in Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE IF EXISTS ship_detections ENABLE ROW LEVEL SECURITY;

-- Create ship_detections table with proper user relationships
CREATE TABLE IF NOT EXISTS ship_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    project_id UUID REFERENCES user_projects(id) ON DELETE SET NULL,
    image_name TEXT,
    image_url TEXT,
    image_hash TEXT, -- For duplicate detection
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

-- Create indexes for better performance
CREATE INDEX idx_ship_detections_user_id ON ship_detections(user_id);
CREATE INDEX idx_ship_detections_session_id ON ship_detections(session_id);
CREATE INDEX idx_ship_detections_project_id ON ship_detections(project_id);
CREATE INDEX idx_ship_detections_timestamp ON ship_detections(timestamp DESC);
CREATE INDEX idx_ship_detections_ship_count ON ship_detections(ship_count);
CREATE INDEX idx_ship_detections_status ON ship_detections(status);
CREATE INDEX idx_ship_detections_image_hash ON ship_detections(image_hash);

-- User table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);

-- Session table indexes
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Project table indexes
CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX idx_user_projects_is_active ON user_projects(is_active);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ship_detections_updated_at 
    BEFORE UPDATE ON ship_detections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_projects_updated_at 
    BEFORE UPDATE ON user_projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create users table for comprehensive user management
CREATE TABLE users (
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

-- Create user_sessions table for anonymous and authenticated users
CREATE TABLE user_sessions (
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

-- Create user_projects table for project management
CREATE TABLE user_projects (
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

-- Create RLS policies (allow all for now, restrict later)
CREATE POLICY "Allow all operations for now" ON ship_detections
    FOR ALL USING (true);

-- Create comprehensive views for analytics and reporting
CREATE VIEW detection_stats AS
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

-- Project statistics view
CREATE VIEW project_stats AS
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

-- Daily detection summary view
CREATE VIEW daily_detection_summary AS
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
```

## Step 3: Get API Keys

1. **Go to Settings → API**
2. **Copy these values:**
   - Project URL: `https://your-project-id.supabase.co`
   - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (for backend)

## Step 4: Frontend Integration

### Install Supabase Client 
```bash
npm install @supabase/supabase-js
```

### Create Supabase Client
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 5: Backend Integration (HF Spaces)

### Add to requirements.txt
```
supabase==2.3.4
python-dotenv==1.0.0
```

### Backend Code
```python
# Add to your Gradio app.py
import os
from supabase import create_client, Client
import json
import time
from datetime import datetime

# Initialize Supabase
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def save_detection_to_db(user_id, image_name, ship_count, confidence_scores, bounding_boxes, processing_time):
    """Save detection result to Supabase database"""
    try:
        data = {
            "user_id": user_id or "anonymous",
            "image_name": image_name,
            "ship_count": ship_count,
            "confidence_scores": confidence_scores,
            "bounding_boxes": bounding_boxes,
            "processing_time_ms": processing_time,
            "detection_metadata": {
                "model": "faster_rcnn_r50_fpn",
                "dataset": "hrsid",
                "version": "1.0"
            }
        }
        
        result = supabase.table('ship_detections').insert(data).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Database error: {e}")
        return None

# Modified detection function
def detect_ships_image(image, confidence_threshold, user_id="anonymous"):
    start_time = time.time()
    
    if image is None:
        return None, "Please upload an image."
    
    img_bgr = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    result_bgr, inst = run_inference(img_bgr, confidence_threshold)
    result_rgb = cv2.cvtColor(result_bgr, cv2.COLOR_BGR2RGB)
    
    processing_time = int((time.time() - start_time) * 1000)
    
    # Save to database
    ship_count = len(inst)
    confidence_scores = inst.scores.tolist() if len(inst) > 0 else []
    bounding_boxes = inst.pred_boxes.tensor.tolist() if len(inst) > 0 else []
    
    save_detection_to_db(
        user_id=user_id,
        image_name=f"detection_{int(time.time())}.jpg",
        ship_count=ship_count,
        confidence_scores=confidence_scores,
        bounding_boxes=bounding_boxes,
        processing_time=processing_time
    )
    
    return result_rgb, build_info(inst)

# Add history endpoint
def get_detection_history(user_id="anonymous", limit=50):
    """Get detection history for a user"""
    try:
        result = supabase.table('ship_detections')\
            .select('*')\
            .eq('user_id', user_id)\
            .order('timestamp', desc=True)\
            .limit(limit)\
            .execute()
        
        return result.data
    except Exception as e:
        print(f"Database error: {e}")
        return []
```

## Step 6: Environment Variables Setup

### For HF Spaces (Secrets)
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### For React Frontend (.env.local)
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 7: Test Database Connection

### Test in Supabase Dashboard
```sql
-- Insert test data
INSERT INTO ship_detections (user_id, ship_count, confidence_scores) 
VALUES ('test_user', 3, '[0.95, 0.87, 0.92]');

-- Query test data
SELECT * FROM ship_detections WHERE user_id = 'test_user';
```

## Step 8: Security Setup (Optional)

### Row Level Security Policies
```sql
-- Allow users to see only their own detections
DROP POLICY IF EXISTS "Allow all operations for now" ON ship_detections;

CREATE POLICY "Users can view own detections" ON ship_detections
    FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own detections" ON ship_detections
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
```

## Expected Database Structure

```json
{
  "id": 1,
  "timestamp": "2024-03-15T10:30:00Z",
  "user_id": "user_123",
  "image_name": "detection_1710504600.jpg",
  "ship_count": 3,
  "confidence_scores": [0.95, 0.87, 0.92],
  "bounding_boxes": [
    [100, 150, 200, 250],
    [300, 100, 400, 200],
    [500, 300, 600, 400]
  ],
  "detection_metadata": {
    "model": "faster_rcnn_r50_fpn",
    "dataset": "hrsid",
    "version": "1.0"
  },
  "processing_time_ms": 1250,
  "created_at": "2024-03-15T10:30:00Z"
}
```

## Costs

- **Free Tier**: 500MB storage, 2GB bandwidth, 50MB file uploads
- **Pro Plan**: $25/month - 8GB storage, 250GB bandwidth
- **Team Plan**: $125/month - 100GB storage, 500GB bandwidth

Your ship detection system should easily fit within the free tier for development and testing!

## Next Steps

1. Create Supabase project
2. Run the SQL schema
3. Get API keys
4. Add environment variables
5. Install Supabase client in React
6. Update HF Spaces backend
7. Test the integration

Would you like me to create the React components for displaying the detection history?