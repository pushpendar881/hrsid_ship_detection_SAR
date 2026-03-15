import React from 'react'

export default function Footer() {
  return (
    <footer style={{ 
      padding: '3rem 2rem 2rem', 
      background: 'var(--bg2)', 
      borderTop: '1px solid var(--border)',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ 
              fontFamily: 'var(--font-hud)', 
              fontSize: '1rem', 
              fontWeight: 800, 
              color: 'var(--teal)',
              letterSpacing: '0.1em',
              marginBottom: '1rem'
            }}>
              SHIPSENSE
            </h3>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-dim)', 
              lineHeight: 1.6,
              marginBottom: '1rem'
            }}>
              Advanced AI-powered maritime surveillance system for real-time ship detection using synthetic aperture radar imagery.
            </p>
          </div>
          
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-hud)', 
              fontSize: '0.7rem', 
              color: 'var(--amber)',
              letterSpacing: '0.2em',
              marginBottom: '1rem'
            }}>
              TECHNOLOGY
            </h4>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem' 
            }}>
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-hud)'
              }}>
                Faster R-CNN Architecture
              </span>
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-hud)'
              }}>
                ResNet-50 + FPN Backbone
              </span>
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-hud)'
              }}>
                Detectron2 Framework
              </span>
            </div>
          </div>
          
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-hud)', 
              fontSize: '0.7rem', 
              color: 'var(--amber)',
              letterSpacing: '0.2em',
              marginBottom: '1rem'
            }}>
              PERFORMANCE
            </h4>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem' 
            }}>
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-hud)'
              }}>
                63.0% AP@0.5
              </span>
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-hud)'
              }}>
                45.3% AP@0.75
              </span>
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-hud)'
              }}>
                9.2K+ Training Images
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid var(--border)', 
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '0.7rem', 
            color: 'var(--text-dim)',
            letterSpacing: '0.05em'
          }}>
            © 2024 SHIPSENSE. ALL RIGHTS RESERVED.
          </p>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '0.6rem', 
            color: 'var(--text-dim)',
            letterSpacing: '0.1em'
          }}>
            POWERED BY ARTIFICIAL INTELLIGENCE
          </div>
        </div>
      </div>
    </footer>
  )
}