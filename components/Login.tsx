'use client'
import { useState } from 'react'

const VALID_EMAIL = 'sofiavergara@gmail.com'
const VALID_PASS = 'privatesofia1'

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 900))
    if (email === VALID_EMAIL && password === VALID_PASS) {
      onLogin()
    } else {
      setError('Invalid email or password. Please try again.')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(160deg, #e8f0e0 0%, #d4ecc0 100%)',
    }}>
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: 64, height: 64,
            background: 'var(--text)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28,
          }}>💸</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>Sign in to your Flo account</p>
        </div>

        <div className={`card ${shake ? 'animate-shake' : ''}`} style={{ padding: '28px 24px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: 0.5,
                  }}
                >{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <a href="#" style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500, textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="animate-fade" style={{
                background: '#fff0f0',
                border: '1px solid #ffd0d0',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 16,
                fontSize: 14,
                color: 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span style={{
                    width: 18, height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <a href="#" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
