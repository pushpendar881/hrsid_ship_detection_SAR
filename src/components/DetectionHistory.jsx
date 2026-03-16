import React, { useState, useEffect } from 'react'
import { dbHelpers } from '../lib/supabase'

function DetectionCard({ detection }) {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConfidenceColor = (score) => {
    if (score > 0.8) return 'var(--teal)'
    if (score > 0.6) return 'var(--amber)'
    return 'var(--red)'
  }

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 4,
      background: 'var(--bg3)',
      padding: '1.5rem',
      marginBottom: '1rem',
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
        background: 'var(--bg3)',
        padding: '0 8px'
      }}>
        DETECTION #{detection.id}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1rem',
        marginTop: '0.5rem'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.6rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
            marginBottom: '0.25rem'
          }}>
            TIMESTAMP
          </div>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.8rem',
            color: 'var(--text)'
          }}>
            {formatDate(detection.timestamp)}
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.6rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
            marginBottom: '0.25rem'
          }}>
            SHIPS DETECTED
          </div>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '1.2rem',
            color: detection.ship_count > 0 ? 'var(--teal)' : 'var(--amber)',
            fontWeight: 700
          }}>
            {detection.ship_count}
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.6rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
            marginBottom: '0.25rem'
          }}>
            PROCESSING TIME
          </div>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.8rem',
            color: 'var(--text)'
          }}>
            {detection.processing_time_ms ? `${detection.processing_time_ms}ms` : 'N/A'}
          </div>
        </div>
      </div>

      {detection.confidence_scores && detection.confidence_scores.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.6rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem'
          }}>
            CONFIDENCE SCORES
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {detection.confidence_scores.map((score, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg2)',
                  border: `1px solid ${getConfidenceColor(score)}`,
                  borderRadius: 2,
                  padding: '0.25rem 0.5rem',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.7rem',
                  color: getConfidenceColor(score)
                }}
              >
                {(score * 100).toFixed(1)}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatsCard({ title, value, subtitle, color = 'var(--teal)' }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 4,
      background: 'var(--bg2)',
      padding: '1.5rem',
      textAlign: 'center',
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
        fontSize: '2rem',
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
    </div>
  )
}

export default function DetectionHistory() {
  const [detections, setDetections] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    
    // Set up real-time subscription for current session
    const setupSubscription = async () => {
      const subscription = await dbHelpers.subscribeToDetections((payload) => {
        setDetections(prev => [payload.new, ...prev])
        // Update stats when new detection comes in
        fetchStats()
      })
      
      return subscription
    }

    setupSubscription()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [detectionsData, statsData] = await Promise.all([
        dbHelpers.getDetectionHistory(20),
        dbHelpers.getSessionStats()
      ])
      
      setDetections(detectionsData)
      setStats(statsData)
    } catch (err) {
      setError('Failed to load detection history')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const statsData = await dbHelpers.getSessionStats()
      setStats(statsData)
    } catch (err) {
      console.error('Error fetching stats:', err)
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
          LOADING HISTORY...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--red)',
        fontFamily: 'var(--font-hud)',
        fontSize: '0.8rem',
        letterSpacing: '0.1em'
      }}>
        {error}
      </div>
    )
  }

  return (
    <section style={{
      padding: '6rem 2rem',
      background: 'var(--bg2)',
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
            DETECTION ANALYTICS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-hud)',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.01em'
          }}>
            DETECTION <span style={{ color: 'var(--teal)' }}>HISTORY</span>
          </h2>
        </div>

        {/* Statistics */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <StatsCard
              title="TOTAL DETECTIONS"
              value={stats.total_detections || 0}
              subtitle="ANALYSIS RUNS"
            />
            <StatsCard
              title="SHIPS FOUND"
              value={stats.total_ships_detected || 0}
              subtitle="TOTAL VESSELS"
              color="var(--amber)"
            />
            <StatsCard
              title="AVG SHIPS/DETECTION"
              value={(stats.avg_ships_per_detection || 0).toFixed(1)}
              subtitle="VESSELS PER IMAGE"
            />
            <StatsCard
              title="AVG PROCESSING"
              value={stats.avg_processing_time ? `${Math.round(stats.avg_processing_time)}ms` : 'N/A'}
              subtitle="INFERENCE TIME"
              color="var(--amber)"
            />
          </div>
        )}

        {/* Detection History */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '2rem',
            color: 'var(--text)'
          }}>
            RECENT DETECTIONS
          </h3>

          {detections.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em'
            }}>
              NO DETECTIONS YET
              <br />
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                Upload an image to start detecting ships
              </span>
            </div>
          ) : (
            <div>
              {detections.map((detection) => (
                <DetectionCard key={detection.id} detection={detection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}