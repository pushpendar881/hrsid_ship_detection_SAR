-- Simplified setup - just what you need right now
CREATE TABLE IF NOT EXISTS ship_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT DEFAULT 'anonymous',
    image_name TEXT,
    image_url TEXT,
    ship_count INTEGER DEFAULT 0,
    confidence_scores JSONB DEFAULT '[]'::jsonb,
    bounding_boxes JSONB DEFAULT '[]'::jsonb,
    detection_metadata JSONB DEFAULT '{
        "model": "faster_rcnn_r50_fpn",
        "dataset": "hrsid",
        "version": "1.0"
    }'::jsonb,
    processing_time_ms INTEGER,
    confidence_threshold REAL DEFAULT 0.5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simple indexes
CREATE INDEX IF NOT EXISTS idx_ship_detections_user_id ON ship_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_ship_detections_timestamp ON ship_detections(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ship_detections_ship_count ON ship_detections(ship_count);

-- Enable RLS
ALTER TABLE ship_detections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON ship_detections FOR ALL USING (true);

-- Simple stats view
CREATE OR REPLACE VIEW detection_summary AS
SELECT 
    user_id,
    COUNT(*) as total_detections,
    SUM(ship_count) as total_ships_detected,
    AVG(ship_count) as avg_ships_per_detection,
    MAX(timestamp) as last_detection,
    AVG(processing_time_ms) as avg_processing_time
FROM ship_detections 
GROUP BY user_id;

SELECT 'Simple database setup completed!' as status;