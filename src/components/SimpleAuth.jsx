import React, { useState, useEffect } from 'react'
import { userHelpers } from '../lib/supabase'

export default function SimpleAuth() {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await userHelpers.getCurrentUser()
    setUser(currentUser)
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isSignup) {
        result = await userHelpers.signupWithEmail(email, password)
      } else {
        result = await userHelpers.loginWithEmail(email, password)
      }

      if (result.error) {
        setError(result.error)
      } else {
        setUser(result.user)
        setShowLogin(false)
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await userHelpers.logout()
    setUser(null)
  }

  if (user) {
    return (
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '0.7rem',
          color: 'var(--teal)'
        }}>
          ✓ {user.email}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-dim)',
            padding: '0.25rem 0.5rem',
            fontSize: '0.6rem',
            fontFamily: 'var(--font-hud)',
            cursor: 'pointer',
            borderRadius: 2
          }}
        >
          LOGOUT
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Login Button */}
      {!showLogin && (
        <button
          onClick={() => setShowLogin(true)}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            background: 'var(--teal)',
            color: '#020d10',
            border: 'none',
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            borderRadius: 4,
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
          }}
        >
          LOGIN
        </button>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '2rem',
            width: '100%',
            maxWidth: 400,
            position: 'relative'
          }}>
            <button
              onClick={() => setShowLogin(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <div style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              color: 'var(--text)'
            }}>
              {isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-dim)',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 2,
                    color: 'var(--text)',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-dim)',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 2,
                    color: 'var(--text)',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  color: 'var(--red)',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-hud)',
                  padding: '0.5rem',
                  background: 'rgba(255,69,69,0.1)',
                  border: '1px solid rgba(255,69,69,0.3)',
                  borderRadius: 2
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'var(--bg3)' : 'var(--teal)',
                  color: loading ? 'var(--text-dim)' : '#020d10',
                  border: 'none',
                  padding: '1rem',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  borderRadius: 2
                }}
              >
                {loading ? 'PROCESSING...' : (isSignup ? 'CREATE ACCOUNT' : 'LOGIN')}
              </button>

              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-dim)',
                  padding: '0.75rem',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.6rem',
                  cursor: 'pointer',
                  borderRadius: 2
                }}
              >
                {isSignup ? 'ALREADY HAVE ACCOUNT? LOGIN' : 'NEED ACCOUNT? SIGN UP'}
              </button>
            </form>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--bg3)',
              borderRadius: 2,
              fontSize: '0.6rem',
              fontFamily: 'var(--font-hud)',
              color: 'var(--text-dim)',
              lineHeight: 1.4
            }}>
              <strong style={{ color: 'var(--amber)' }}>OPTIONAL:</strong> You can use the app anonymously. 
              Login only if you want to save your detection history across devices.
            </div>
          </div>
        </div>
      )}
    </>
  )
}