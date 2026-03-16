# Ship Detection Database Architecture

## Current Flow
```
USER BROWSER → REACT FRONTEND (Render) → HF SPACES BACKEND → DATABASE
                     ↓                           ↓              ↓
              Show Results ←─── API Response ←─── Store Data
                     ↓
              GET /history ──────────────────────────────────→ Fetch History
```

## Database Schema Design

### Table: `ship_detections`
```sql
CREATE TABLE ship_detections (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    image_name VARCHAR(255),
    image_url TEXT,
    ship_count INTEGER,
    confidence_scores JSON,  -- Array of confidence values
    bounding_boxes JSON,     -- Array of [x1,y1,x2,y2] coordinates
    detection_metadata JSON, -- Additional info (model version, etc.)
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_id ON ship_detections(user_id);
CREATE INDEX idx_timestamp ON ship_detections(timestamp);
CREATE INDEX idx_ship_count ON ship_detections(ship_count);
```

### Table: `users` (Optional)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_detections INTEGER DEFAULT 0,
    last_detection TIMESTAMP
);
```

## Recommended Cloud Databases

### 🥇 **1. Supabase (RECOMMENDED)**
**Best for: Full-stack integration with real-time features**

**Pros:**
- ✅ PostgreSQL-based (powerful JSON support)
- ✅ Built-in REST API + real-time subscriptions
- ✅ Free tier: 500MB storage, 2GB bandwidth
- ✅ Built-in authentication
- ✅ Easy integration with React
- ✅ Automatic API generation
- ✅ Real-time updates for detection history

**Cons:**
- ❌ Learning curve for new users

**Setup:**
```bash
npm install @supabase/supabase-js
```

**Cost:** Free → $25/month

---

### 🥈 **2. PlanetScale (MySQL)**
**Best for: Scalable MySQL with branching**

**Pros:**
- ✅ MySQL-compatible
- ✅ Database branching (like Git)
- ✅ Excellent performance
- ✅ Free tier: 1GB storage, 1 billion reads
- ✅ Serverless scaling

**Cons:**
- ❌ No built-in real-time features
- ❌ Limited JSON support vs PostgreSQL

**Cost:** Free → $39/month

---

### 🥉 **3. Railway PostgreSQL**
**Best for: Simple PostgreSQL hosting**

**Pros:**
- ✅ Simple PostgreSQL hosting
- ✅ Easy deployment
- ✅ Good for development
- ✅ $5/month starter plan

**Cons:**
- ❌ No free tier
- ❌ No built-in API layer

---

### 🏆 **4. Neon (Serverless PostgreSQL)**
**Best for: Serverless PostgreSQL with auto-scaling**

**Pros:**
- ✅ Serverless PostgreSQL
- ✅ Auto-scaling and auto-pause
- ✅ Free tier: 3GB storage
- ✅ Excellent for development
- ✅ Branch databases

**Cons:**
- ❌ Newer service (less mature)
- ❌ No built-in API layer

**Cost:** Free → $19/month

---

### 🔥 **5. Firebase Firestore**
**Best for: NoSQL with real-time sync**

**Pros:**
- ✅ Real-time synchronization
- ✅ NoSQL flexibility
- ✅ Google Cloud integration
- ✅ Free tier: 1GB storage, 50K reads/day
- ✅ Built-in authentication

**Cons:**
- ❌ NoSQL learning curve
- ❌ Complex queries can be expensive
- ❌ Less suitable for analytics

**Cost:** Free → Pay-as-you-go

## 🏆 **RECOMMENDATION: Supabase**

For your ship detection system, **Supabase** is the best choice because:

1. **PostgreSQL** - Perfect for storing JSON data (bounding boxes, confidence scores)
2. **Auto-generated REST API** - No backend coding needed
3. **Real-time subscriptions** - Users can see live detection history
4. **Built-in authentication** - User management out of the box
5. **React integration** - Excellent React hooks and components
6. **Free tier** - Generous limits for development and testing

## Implementation Plan

### Phase 1: Database Setup (Supabase)
```javascript
// supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Phase 2: Backend Integration (HF Spaces)
```python
# Add to your Gradio app
import supabase
import json
from datetime import datetime

# Initialize Supabase client
supabase_client = supabase.create_client(
    "https://your-project.supabase.co",
    "your-service-role-key"
)

def save_detection_result(user_id, image_name, ship_count, confidence_scores, bounding_boxes):
    data = {
        "user_id": user_id,
        "image_name": image_name,
        "ship_count": ship_count,
        "confidence_scores": confidence_scores,
        "bounding_boxes": bounding_boxes,
        "timestamp": datetime.now().isoformat()
    }
    
    result = supabase_client.table('ship_detections').insert(data).execute()
    return result

# Modified detection function
def detect_ships_image(image, confidence_threshold, user_id="anonymous"):
    # ... existing detection code ...
    
    # Save to database
    save_detection_result(
        user_id=user_id,
        image_name=f"detection_{int(time.time())}.jpg",
        ship_count=len(instances),
        confidence_scores=instances.scores.tolist(),
        bounding_boxes=instances.pred_boxes.tensor.tolist()
    )
    
    return result_rgb, build_info(inst)
```

### Phase 3: Frontend Integration
```javascript
// DetectionHistory.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DetectionHistory({ userId }) {
  const [detections, setDetections] = useState([])

  useEffect(() => {
    fetchDetections()
    
    // Real-time subscription
    const subscription = supabase
      .channel('detections')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'ship_detections' },
        (payload) => {
          setDetections(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [userId])

  const fetchDetections = async () => {
    const { data } = await supabase
      .from('ship_detections')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50)
    
    setDetections(data || [])
  }

  return (
    <div>
      <h3>Detection History</h3>
      {detections.map(detection => (
        <div key={detection.id}>
          <p>Ships: {detection.ship_count}</p>
          <p>Time: {new Date(detection.timestamp).toLocaleString()}</p>
          <p>Confidence: {detection.confidence_scores?.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}
```

## Next Steps

1. **Choose Supabase** (recommended)
2. **Set up database schema**
3. **Integrate with HF Spaces backend**
4. **Add history component to React frontend**
5. **Add user authentication** (optional)
6. **Add analytics dashboard** (future)

Would you like me to help you implement the Supabase integration?
