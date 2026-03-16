import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User session management
export const userHelpers = {
  // Get current user (authenticated or anonymous)
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Simple email login
  async loginWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Create or update user profile
      await this.createOrUpdateUserProfile(data.user)

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Simple email signup
  async signupWithEmail(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get or create session (works for both anonymous and authenticated users)
  async getOrCreateSession() {
    const user = await this.getCurrentUser()

    if (user) {
      // Authenticated user - use their user ID
      return {
        id: user.id,
        session_id: user.id,
        is_anonymous: false,
        user_id: user.id,
        email: user.email
      }
    }

    // Anonymous user - use localStorage session
    let sessionId = localStorage.getItem('ship_detection_session')

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('ship_detection_session', sessionId)

      // Create session in database
      try {
        const { data, error } = await supabase
          .from('user_sessions')
          .insert({
            session_id: sessionId,
            is_anonymous: true,
            user_agent: navigator.userAgent
          })
          .select()
          .single()

        if (error) throw error
        localStorage.setItem('ship_detection_session_uuid', data.id)
        return data
      } catch (error) {
        console.error('Error creating session:', error)
        return { id: null, session_id: sessionId, is_anonymous: true }
      }
    }

    return {
      id: localStorage.getItem('ship_detection_session_uuid'),
      session_id: sessionId,
      is_anonymous: true
    }
  },

  // Create or update user profile
  async createOrUpdateUserProfile(user) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          last_login: new Date().toISOString(),
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating/updating user profile:', error)
      return null
    }
  },

  // Create user profile (for future registration)
  async createUserProfile(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  },

  // Check API quota
  async checkApiQuota(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('api_quota_used, api_quota_limit, subscription_tier')
        .eq('id', userId)
        .single()

      if (error) throw error
      return {
        used: data.api_quota_used,
        limit: data.api_quota_limit,
        tier: data.subscription_tier,
        canDetect: data.api_quota_used < data.api_quota_limit
      }
    } catch (error) {
      console.error('Error checking quota:', error)
      return { canDetect: true } // Allow anonymous users
    }
  }
}

// Database helper functions
export const dbHelpers = {
  // Save detection result
  async saveDetection(detectionData) {
    try {
      const session = await userHelpers.getOrCreateSession()

      const data = {
        user_id: session.is_anonymous ? null : session.user_id,
        session_id: session.is_anonymous ? session.id : null,
        image_name: detectionData.image_name,
        image_url: detectionData.image_url,
        image_hash: detectionData.image_hash,
        ship_count: detectionData.ship_count,
        confidence_scores: detectionData.confidence_scores,
        bounding_boxes: detectionData.bounding_boxes,
        processing_time_ms: detectionData.processing_time_ms,
        confidence_threshold: detectionData.confidence_threshold || 0.5,
        detection_metadata: {
          model: "faster_rcnn_r50_fpn",
          dataset: "hrsid",
          version: "1.0",
          processing_location: "hf_spaces",
          user_type: session.is_anonymous ? "anonymous" : "authenticated",
          ...detectionData.metadata
        }
      }

      const { data: result, error } = await supabase
        .from('ship_detections')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return result
    } catch (error) {
      console.error('Error saving detection:', error)
      return null
    }
  },

  // Get detection history for current session/user
  async getDetectionHistory(limit = 50) {
    try {
      const session = await userHelpers.getOrCreateSession()

      let query = supabase
        .from('ship_detections')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (session.is_anonymous) {
        // Anonymous user - filter by session_id
        query = query.eq('session_id', session.id)
      } else {
        // Authenticated user - filter by user_id
        query = query.eq('user_id', session.user_id)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching detection history:', error)
      return []
    }
  },

  // Get detection statistics for current session/user
  async getSessionStats() {
    try {
      const session = await userHelpers.getOrCreateSession()

      let query = supabase
        .from('ship_detections')
        .select('ship_count, processing_time_ms, timestamp')

      if (session.is_anonymous) {
        query = query.eq('session_id', session.id)
      } else {
        query = query.eq('user_id', session.user_id)
      }

      const { data, error } = await query

      if (error) throw error

      if (!data || data.length === 0) {
        return {
          total_detections: 0,
          total_ships: 0,
          avg_ships_per_detection: 0,
          avg_processing_time: 0,
          last_detection: null
        }
      }

      return {
        total_detections: data.length,
        total_ships: data.reduce((sum, d) => sum + d.ship_count, 0),
        avg_ships_per_detection: data.reduce((sum, d) => sum + d.ship_count, 0) / data.length,
        avg_processing_time: data.reduce((sum, d) => sum + (d.processing_time_ms || 0), 0) / data.length,
        last_detection: data[0]?.timestamp
      }
    } catch (error) {
      console.error('Error fetching session stats:', error)
      return {
        total_detections: 0,
        total_ships: 0,
        avg_ships_per_detection: 0,
        avg_processing_time: 0,
        last_detection: null
      }
    }
  },

  // Subscribe to real-time detection updates for current session/user
  async subscribeToDetections(callback) {
    const session = await userHelpers.getOrCreateSession()

    const filter = session.is_anonymous
      ? `session_id=eq.${session.id}`
      : `user_id=eq.${session.user_id}`

    return supabase
      .channel('user_detections')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ship_detections',
          filter: filter
        },
        callback
      )
      .subscribe()
  },

  // Get global statistics (for admin dashboard)
  async getGlobalStats() {
    try {
      const { data, error } = await supabase
        .from('daily_detection_summary')
        .select('*')
        .limit(30)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching global stats:', error)
      return []
    }
  },

  // Get user analytics (for research insights)
  async getUserAnalytics() {
    try {
      const { data, error } = await supabase
        .from('detection_stats')
        .select('*')
        .order('total_detections', { ascending: false })
        .limit(100)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      return []
    }
  }
}