import React from 'react'

export default function Hero() {
  return (
    <section style={{ 
      padding: '8rem 2rem 4rem', 
      textAlign: 'center',
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      <div style={{ 
        fontFamily: 'var(--font-hud)', 
        fontSize: '0.6rem', 
        letterSpacing: '0.3em', 
        color: 'var(--amber)', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
      }}>
        <span style={{ width: 20, height: 1, background: 'var(--amber)', display: 'inline-block' }}/>
        MARITIME AI SURVEILLANCE
        <span style={{ width: 20, height: 1, background: 'var(--amber)', display: 'inline-block' }}/>
      </div>
      
      <h1 style={{ 
        fontFamily: 'var(--font-hud)', 
        fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
        fontWeight: 800, 
        letterSpacing: '-0.02em',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, var(--text) 0%, var(--teal) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        SHIP DETECTION<br/>
        <span style={{ color: 'var(--teal)' }}>SYSTEM</span>
      </h1>
      
      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--text-dim)', 
        maxWidth: 600, 
        margin: '0 auto',
        lineHeight: 1.6
      }}>
        Advanced AI-powered synthetic aperture radar (SAR) analysis for real-time maritime vessel detection and classification
      </p>
      
      <div style={{ 
        marginTop: '3rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '1.5rem', 
            color: 'var(--teal)',
            fontWeight: 700
          }}>63.0%</div>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '0.6rem', 
            color: 'var(--text-dim)',
            letterSpacing: '0.1em'
          }}>AP@0.5 ACCURACY</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '1.5rem', 
            color: 'var(--amber)',
            fontWeight: 700
          }}>&lt;1.5s</div>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '0.6rem', 
            color: 'var(--text-dim)',
            letterSpacing: '0.1em'
          }}>INFERENCE TIME</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '1.5rem', 
            color: 'var(--teal)',
            fontWeight: 700
          }}>9.2K+</div>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '0.6rem', 
            color: 'var(--text-dim)',
            letterSpacing: '0.1em'
          }}>TRAINING IMAGES</div>
        </div>
      </div>
    </section>
  )
}