import React from 'react'

export default function About() {
  return (
    <section style={{ 
      padding: '6rem 2rem',
      background: 'var(--bg)'
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
            <span style={{ width: 20, height: 1, background: 'var(--amber)', display: 'inline-block' }}/>
            ABOUT THE PROJECT
          </div>
          <h2 style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: 800, 
            letterSpacing: '-0.01em' 
          }}>
            MARITIME <span style={{ color: 'var(--teal)' }}>SURVEILLANCE</span>
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-dim)', 
              lineHeight: 1.8,
              marginBottom: '2rem'
            }}>
              ShipSense leverages a Faster R-CNN model with ResNet-50 backbone, trained on the High-Resolution SAR Images Dataset (HRSID) to provide accurate ship detection in synthetic aperture radar imagery.
            </p>
            
            <p style={{ 
              fontSize: '1rem', 
              color: 'var(--text-dim)', 
              lineHeight: 1.7,
              marginBottom: '2rem'
            }}>
              Our system processes SAR satellite imagery with 63% AP@0.5 accuracy, enabling reliable maritime surveillance for security, environmental monitoring, and commercial applications.
            </p>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  background: 'var(--teal)', 
                  borderRadius: '50%' 
                }}/>
                <span style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.8rem', 
                  color: 'var(--text)',
                  letterSpacing: '0.05em'
                }}>
                  HRSID dataset training
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  background: 'var(--teal)', 
                  borderRadius: '50%' 
                }}/>
                <span style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.8rem', 
                  color: 'var(--text)',
                  letterSpacing: '0.05em'
                }}>
                  Detectron2 framework
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  background: 'var(--teal)', 
                  borderRadius: '50%' 
                }}/>
                <span style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.8rem', 
                  color: 'var(--text)',
                  letterSpacing: '0.05em'
                }}>
                  63% AP@0.5 accuracy
                </span>
              </div>
            </div>
          </div>

          <div style={{ 
            border: '1px solid var(--border)', 
            borderRadius: 4,
            background: 'var(--bg2)', 
            padding: '2rem',
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
              APPLICATIONS
            </div>
            
            <div style={{ 
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.7rem', 
                  color: 'var(--amber)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}>
                  MARITIME SECURITY
                </div>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-dim)', 
                  lineHeight: 1.5 
                }}>
                  Border patrol and illegal fishing detection
                </p>
              </div>
              
              <div>
                <div style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.7rem', 
                  color: 'var(--amber)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}>
                  ENVIRONMENTAL MONITORING
                </div>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-dim)', 
                  lineHeight: 1.5 
                }}>
                  Oil spill response and marine protection
                </p>
              </div>
              
              <div>
                <div style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.7rem', 
                  color: 'var(--amber)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}>
                  COMMERCIAL SHIPPING
                </div>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-dim)', 
                  lineHeight: 1.5 
                }}>
                  Traffic monitoring and route optimization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}