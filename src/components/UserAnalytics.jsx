import React, { useState, useEffect } from 'react'
import { dbHelpers, userHelpers } from '../lib/supabase'

function MetricCard({ title, value, subtitle, trend, color = 'var(--teal)' }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 4,
      background: 'var(--bg2)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: -10,
        left: 16,
        fontFamily: 'var(--font-hud)',
        fontSize: '0.55rem',
        letterSpacing: '0.2em',
        color: 'var(--teal)',
        background: 'var(--bg2)',
        padding: '0 8px'
      }}>
        {title}
      </div>
      
      <div style={{
        fontFamily: 'var(--font-hud)',
        fontSize: '2.5rem',
        color: color,
        fontWeight: 700,
        marginTop: '0.5rem',
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      
      {subtitle && (
        <div style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '0.6rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.1em'
        }}>
          {subtitle}
        </div>
      )}
      
      {trend && (
        <div style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '0.55rem',
          color: trend > 0 ? 'var(--teal)' : 'var(--red)',
          marginTop: '0.5rem'
        }}>
          {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% vs last period
        </div>
      )}
    </div>
  )
}

function SessionInfo({ session }) {
  if (!session) return null
  
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 4,
      background: 'var(--bg3)',
      padding: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        fontFamily: 'var(--font-hud)',
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        color: 'var(--amber)',
        marginBottom: '0.5rem'
      }}>
        CURRENT SESSION
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-hud)'
      }}>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>ID: </span>
          <span style={{ color: 'var(--text)' }}>{session.session_id?.substring(0, 8)}...</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>Type: </span>
          <span style={{ color: 'var(--teal)' }}>
            {session.is_anonymous ? 'ANONYMOUS' : 'REGISTERED'}
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>Created: </span>
          <span style={{ color: 'var(--text)' }}>
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function UserAnalytics() {
  const [stats, setStats] = useState(null)
  const [globalStats, setGlobalStats] = useState([])
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Get current session info
      const sessionData = await userHelpers.getOrCreateSession()
      setSession(sessionData)
      
      // Get session statistics
      const sessionStats = await dbHelpers.getSessionStats()
      setStats(sessionStats)
      
      // Get global statistics for context
      const globalData = await dbHelpers.getGlobalStats()
      setGlobalStats(globalData.slice(0, 7)) // Last 7 days
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem',
        color: 'var(--text-dim)'
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: '2px solid var(--border)',
          borderTopColor: 'var(--teal)',
          borderRadius: '50%',
          animation: 'spin-slow 0.8s linear infinite'
        }} />
        <span style={{
          marginLeft: '1rem',
          fontFamily: 'var(--font-hud)',
          fontSize: '0.8rem',
          letterSpacing: '0.1em'
        }}>
          LOADING ANALYTICS...
        </span>
      </div>
    )
  }

  const totalGlobalDetections = globalStats.reduce((sum, day) => sum + day.total_detections, 0)
  const totalGlobalShips = globalStats.reduce((sum, day) => sum + day.total_ships, 0)
  const avgProcessingTime = globalStats.length > 0 
    ? globalStats.reduce((sum, day) => sum + day.avg_processing_time, 0) / globalStats.length 
    : 0

  return (
    <section style={{
      padding: '6rem 2rem',
      background: 'var(--bg1)',
      borderTop: '1px solid var(--border)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            color: 'var(--amber)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{ width: 20, height: 1, background: 'var(--amber)', display: 'inline-block' }} />
            USER ANALYTICS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-hud)',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.01em'
          }}>
            SESSION <span style={{ color: 'var(--teal)' }}>INSIGHTS</span>
          </h2>
        </div>

        <SessionInfo session={session} />

        {/* Your Session Stats */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '2rem',
            color: 'var(--text)'
          }}>
            YOUR SESSION STATISTICS
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <MetricCard
              title="DETECTIONS RUN"
              value={stats?.total_detections || 0}
              subtitle="IMAGES ANALYZED"
            />
            <MetricCard
              title="SHIPS FOUND"
              value={stats?.total_ships || 0}
              subtitle="TOTAL VESSELS"
              color="var(--amber)"
            />
            <MetricCard
              title="AVG SHIPS/IMAGE"
              value={(stats?.avg_ships_per_detection || 0).toFixed(1)}
              subtitle="DETECTION DENSITY"
            />
            <MetricCard
              title="AVG PROCESSING"
              value={stats?.avg_processing_time ? `${Math.round(stats.avg_processing_time)}ms` : 'N/A'}
              subtitle="INFERENCE TIME"
              color="var(--teal)"
            />
          </div>
        </div>

        {/* Global Platform Stats */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '2rem',
            color: 'var(--text)'
          }}>
            PLATFORM STATISTICS (LAST 7 DAYS)
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <MetricCard
              title="TOTAL DETECTIONS"
              value={totalGlobalDetections}
              subtitle="ACROSS ALL USERS"
              color="var(--teal)"
            />
            <MetricCard
              title="SHIPS DETECTED"
              value={totalGlobalShips}
              subtitle="PLATFORM WIDE"
              color="var(--amber)"
            />
            <MetricCard
              title="ACTIVE USERS"
              value={globalStats.reduce((sum, day) => Math.max(sum, day.unique_users), 0)}
              subtitle="PEAK DAILY USERS"
            />
            <MetricCard
              title="AVG PROCESSING"
              value={avgProcessingTime ? `${Math.round(avgProcessingTime)}ms` : 'N/A'}
              subtitle="SYSTEM PERFORMANCE"
              color="var(--teal)"
            />
          </div>
        </div>

        {/* Daily Activity Chart */}
        {globalStats.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '2rem',
              color: 'var(--text)'
            }}>
              DAILY ACTIVITY
            </h3>
            
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: 4,
              background: 'var(--bg2)',
              padding: '2rem'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${globalStats.length}, 1fr)`,
                gap: '1rem',
                alignItems: 'end',
                height: '200px'
              }}>
                {globalStats.map((day, index) => {
                  const maxDetections = Math.max(...globalStats.map(d => d.total_detections))
                  const height = maxDetections > 0 ? (day.total_detections / maxDetections) * 160 : 0
                  
                  return (
                    <div key={index} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          background: 'var(--teal)',
                          height: `${height}px`,
                          borderRadius: '2px 2px 0 0',
                          marginBottom: '0.5rem',
                          opacity: 0.8,
                          transition: 'opacity 0.2s'
                        }}
                        title={`${day.total_detections} detections`}
                      />
                      <div style={{
                        fontFamily: 'var(--font-hud)',
                        fontSize: '0.6rem',
                        color: 'var(--text-dim)',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center'
                      }}>
                        {new Date(day.detection_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}