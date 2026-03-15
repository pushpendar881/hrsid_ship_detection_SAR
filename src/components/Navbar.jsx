import React from 'react'

export default function Navbar() {
    return (
        <nav style={{
            padding: '1rem 2rem',
            background: 'var(--bg2)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <h2 style={{
                    fontFamily: 'var(--font-hud)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--teal)',
                    letterSpacing: '0.1em'
                }}>
                    SHIPSENSE
                </h2>
                <div style={{
                    fontFamily: 'var(--font-hud)',
                    fontSize: '0.6rem',
                    color: 'var(--text-dim)',
                    letterSpacing: '0.2em'
                }}>
                    SAR DETECTION SYSTEM
                </div>
            </div>
        </nav>
    )
}