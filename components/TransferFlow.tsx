'use client'
import { useState } from 'react'

type Step = 'recipient' | 'amount' | 'bank-details' | 'review' | 'processing' | 'failed'

interface TransferData {
  recipientName: string
  recipientEmail: string
  amount: string
  memo: string
  routingNumber: string
  accountNumber: string
  bankName: string
  accountType: 'checking' | 'savings'
}

const BALANCE = 18000

const US_BANKS = [
  'Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank',
  'US Bank', 'Goldman Sachs', 'Capital One', 'TD Bank',
]

function ProgressBar({ step }: { step: Step }) {
  const steps: Step[] = ['recipient', 'amount', 'bank-details', 'review']
  const current = steps.indexOf(step)
  if (current === -1) return null
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
      {steps.map((s, i) => (
        <div key={s} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i <= current ? 'var(--text)' : 'var(--border)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  )
}

export default function TransferFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>('recipient')
  const [data, setData] = useState<TransferData>({
    recipientName: '',
    recipientEmail: '',
    amount: '',
    memo: '',
    routingNumber: '',
    accountNumber: '',
    bankName: '',
    accountType: 'checking',
  })
  const [errors, setErrors] = useState<Partial<TransferData>>({})
  const [processingDot, setProcessingDot] = useState(0)

  const update = (k: keyof TransferData, v: string) => {
    setData(prev => ({ ...prev, [k]: v }))
    setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const validate = (): boolean => {
    const errs: Partial<TransferData> = {}
    if (step === 'recipient') {
      if (!data.recipientName.trim()) errs.recipientName = 'Name is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recipientEmail)) errs.recipientEmail = 'Valid email required'
    }
    if (step === 'amount') {
      const amt = parseFloat(data.amount)
      if (!data.amount || isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid amount'
      else if (amt > BALANCE) errs.amount = 'Insufficient balance'
      else if (amt < 1) errs.amount = 'Minimum transfer is $1.00'
    }
    if (step === 'bank-details') {
      if (!/^\d{9}$/.test(data.routingNumber)) errs.routingNumber = 'Must be exactly 9 digits'
      if (!/^\d{8,17}$/.test(data.accountNumber)) errs.accountNumber = '8–17 digit account number required'
      if (!data.bankName) errs.bankName = 'Select a bank'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (!validate()) return
    const flow: Step[] = ['recipient', 'amount', 'bank-details', 'review', 'processing', 'failed']
    const i = flow.indexOf(step)
    setStep(flow[i + 1])
  }

  const submitTransfer = () => {
    setStep('processing')
    let dot = 0
    const interval = setInterval(() => {
      dot = (dot + 1) % 4
      setProcessingDot(dot)
    }, 400)
    setTimeout(() => {
      clearInterval(interval)
      setStep('failed')
    }, 3800)
  }

  const fieldError = (k: keyof TransferData) =>
    errors[k] ? (
      <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>⚠</span> {errors[k]}
      </div>
    ) : null

  const inputStyle = (k: keyof TransferData) => ({
    borderColor: errors[k] ? 'var(--red)' : undefined,
  })

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100dvh',
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      {step !== 'processing' && step !== 'failed' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 0' }}>
          <button
            onClick={step === 'recipient' ? onBack : () => {
              const flow: Step[] = ['recipient', 'amount', 'bank-details', 'review']
              const i = flow.indexOf(step)
              if (i > 0) setStep(flow[i - 1])
              else onBack()
            }}
            style={{
              background: 'var(--surface)', border: 'none', borderRadius: 12,
              width: 40, height: 40, cursor: 'pointer', fontSize: 18,
            }}
          >←</button>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Bank Transfer</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>ACH · Standard (1–3 business days)</p>
          </div>
        </div>
      )}

      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        {/* STEP 1: Recipient */}
        {step === 'recipient' && (
          <div className="animate-slide-up">
            <ProgressBar step={step} />
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Who are you sending to?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Enter the recipient&apos;s information</p>
            </div>
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>FULL NAME</label>
                <input
                  className="input-field"
                  style={inputStyle('recipientName')}
                  placeholder="John Smith"
                  value={data.recipientName}
                  onChange={e => update('recipientName', e.target.value)}
                />
                {fieldError('recipientName')}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>EMAIL ADDRESS</label>
                <input
                  className="input-field"
                  style={inputStyle('recipientEmail')}
                  type="email"
                  placeholder="john@example.com"
                  value={data.recipientEmail}
                  onChange={e => update('recipientEmail', e.target.value)}
                />
                {fieldError('recipientEmail')}
              </div>
            </div>
            <button className="btn-primary" onClick={next}>Continue →</button>
          </div>
        )}

        {/* STEP 2: Amount */}
        {step === 'amount' && (
          <div className="animate-slide-up">
            <ProgressBar step={step} />
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>How much to send?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Available balance: <strong>${BALANCE.toLocaleString()}.00</strong></p>
            </div>

            <div className="card" style={{ padding: '24px 20px', marginBottom: 16, textAlign: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 4, marginBottom: 8,
              }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                <input
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 48, fontWeight: 800, letterSpacing: '-2px',
                    width: '100%', textAlign: 'center', color: 'var(--text)',
                    fontFamily: 'DM Mono, monospace',
                  }}
                  placeholder="0.00"
                  type="number"
                  min="1"
                  step="0.01"
                  value={data.amount}
                  onChange={e => update('amount', e.target.value)}
                />
              </div>
              {fieldError('amount')}
              <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                {[100, 500, 1000, 2500].map(v => (
                  <button
                    key={v}
                    onClick={() => update('amount', String(v))}
                    style={{
                      background: data.amount === String(v) ? 'var(--text)' : 'var(--surface2)',
                      color: data.amount === String(v) ? 'white' : 'var(--text)',
                      border: 'none', borderRadius: 10, padding: '6px 12px',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                  >${v}</button>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>MEMO (OPTIONAL)</label>
              <input
                className="input-field"
                placeholder="What's this for?"
                value={data.memo}
                onChange={e => update('memo', e.target.value)}
                maxLength={100}
              />
            </div>

            <div style={{
              background: 'var(--surface2)', borderRadius: 14, padding: '12px 16px',
              marginBottom: 16, fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8,
            }}>
              <span>ℹ️</span>
              <span>ACH transfers typically arrive in 1–3 business days. No transfer fees for standard delivery.</span>
            </div>

            <button className="btn-primary" onClick={next}>Continue →</button>
          </div>
        )}

        {/* STEP 3: Bank Details */}
        {step === 'bank-details' && (
          <div className="animate-slide-up">
            <ProgressBar step={step} />
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Bank account details</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>We need the recipient&apos;s US bank info</p>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>BANK NAME</label>
                <select
                  className="input-field"
                  style={{ ...inputStyle('bankName'), appearance: 'none' }}
                  value={data.bankName}
                  onChange={e => update('bankName', e.target.value)}
                >
                  <option value="">Select a bank…</option>
                  {US_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {fieldError('bankName')}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>ACCOUNT TYPE</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {(['checking', 'savings'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => update('accountType', t)}
                      style={{
                        flex: 1, padding: '12px', border: '1.5px solid',
                        borderColor: data.accountType === t ? 'var(--text)' : 'var(--border)',
                        borderRadius: 12, background: data.accountType === t ? 'var(--text)' : 'transparent',
                        color: data.accountType === t ? 'white' : 'var(--text)',
                        fontWeight: 600, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize',
                        transition: 'all 0.2s',
                      }}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  ROUTING NUMBER <span style={{ fontWeight: 400, textTransform: 'none' }}>(9 digits)</span>
                </label>
                <input
                  className="input-field"
                  style={inputStyle('routingNumber')}
                  placeholder="021000021"
                  type="tel"
                  maxLength={9}
                  value={data.routingNumber}
                  onChange={e => update('routingNumber', e.target.value.replace(/\D/g, ''))}
                />
                {fieldError('routingNumber')}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  ACCOUNT NUMBER <span style={{ fontWeight: 400, textTransform: 'none' }}>(8–17 digits)</span>
                </label>
                <input
                  className="input-field"
                  style={inputStyle('accountNumber')}
                  placeholder="••••••••••••"
                  type="tel"
                  maxLength={17}
                  value={data.accountNumber}
                  onChange={e => update('accountNumber', e.target.value.replace(/\D/g, ''))}
                />
                {fieldError('accountNumber')}
              </div>
            </div>

            <div style={{
              background: '#fffbeb', border: '1px solid #fde68a',
              borderRadius: 14, padding: '12px 16px',
              marginBottom: 16, fontSize: 13, color: '#92400e', display: 'flex', gap: 8,
            }}>
              <span>🔒</span>
              <span>Your banking information is encrypted and never stored on our servers.</span>
            </div>

            <button className="btn-primary" onClick={next}>Review Transfer →</button>
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 'review' && (
          <div className="animate-slide-up">
            <ProgressBar step={step} />
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Review & Confirm</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Double-check everything before sending</p>
            </div>

            {/* Amount hero */}
            <div className="card" style={{ padding: '24px', marginBottom: 16, textAlign: 'center', background: 'var(--accent)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.6, marginBottom: 6 }}>SENDING</div>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-2px' }}>
                ${parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 13, opacity: 0.6, marginTop: 6 }}>USD · ACH Standard</div>
            </div>

            <div className="card" style={{ padding: '0', marginBottom: 16, overflow: 'hidden' }}>
              {[
                { label: 'To', value: data.recipientName },
                { label: 'Email', value: data.recipientEmail },
                { label: 'Bank', value: data.bankName },
                { label: 'Account', value: `${data.accountType.charAt(0).toUpperCase() + data.accountType.slice(1)} ••••${data.accountNumber.slice(-4)}` },
                { label: 'Routing', value: `••••••${data.routingNumber.slice(-3)}` },
                { label: 'Arrives', value: '1–3 business days' },
                { label: 'Fee', value: 'Free' },
                ...(data.memo ? [{ label: 'Memo', value: data.memo }] : []),
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '14px 18px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{row.label}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 14, padding: '12px 16px',
              marginBottom: 20, fontSize: 13, color: '#166534', display: 'flex', gap: 8,
            }}>
              <span>✅</span>
              <span>By confirming, you authorize Flo to initiate this ACH transfer from your account.</span>
            </div>

            <button className="btn-accent" onClick={submitTransfer} style={{ fontSize: 16, fontWeight: 700 }}>
              Confirm & Send $
              {parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </button>
          </div>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            padding: '40px 24px', gap: 24,
          }}>
            {/* Animated ring */}
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <div style={{
                position: 'absolute', inset: 0,
                border: '3px solid var(--accent)',
                borderRadius: '50%',
                animation: 'pulse-ring 1.4s ease-out infinite',
              }} />
              <div style={{
                position: 'absolute', inset: 8,
                background: 'var(--accent)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
              }}>💸</div>
            </div>

            <div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Processing Transfer</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                Sending ${parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} to {data.recipientName}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: i === processingDot ? 'var(--text)' : 'var(--border)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Contacting {data.bankName}…<br />
              Please don&apos;t close this window
            </div>
          </div>
        )}

        {/* Failed */}
        {step === 'failed' && (
          <div className="animate-fade" style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '32px 20px', gap: 20, textAlign: 'center',
          }}>
            {/* Error icon */}
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: '#fef2f2',
              border: '2px solid #fca5a5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40,
              animation: 'shake 0.5s ease',
            }}>❌</div>

            <div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--red)', marginBottom: 8 }}>
                Transfer Failed
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.5 }}>
                We weren&apos;t able to complete your transfer of{' '}
                <strong>${parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>{' '}
                to <strong>{data.recipientName}</strong>.
              </p>
            </div>

            {/* Error card */}
            <div style={{
              background: '#fef2f2', border: '1.5px solid #fca5a5',
              borderRadius: 18, padding: '20px', width: '100%', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🏦</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#9b1c1c', marginBottom: 4 }}>BANK NETWORK ERROR</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--red)' }}>ACH Return Code: R03</div>
                  <div style={{ fontSize: 12, color: '#9b1c1c', marginTop: 2 }}>No Account / Unable to Locate Account</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.6 }}>
                The recipient&apos;s bank is temporarily unavailable. Please try again in a few moments.
              </p>
            </div>

            {/* Hints */}
            <div style={{
              background: '#fffbeb', border: '1.5px solid #fde68a',
              borderRadius: 18, padding: '18px', width: '100%', textAlign: 'left',
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💡</span> What likely went wrong
              </div>
              {[
                { icon: '🔢', text: 'Account number may have been entered incorrectly — double-check all digits' },
                { icon: '🏦', text: 'The routing number may not match the selected bank — verify with recipient' },
                { icon: '📋', text: 'Account may have been closed or transferred since the recipient last confirmed it' },
                { icon: '✅', text: 'Ask the recipient to verify their account details via a voided check or bank statement' },
              ].map((hint, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                  <span style={{ flexShrink: 0, fontSize: 15 }}>{hint.icon}</span>
                  <span style={{ fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>{hint.text}</span>
                </div>
              ))}
            </div>

            {/* Info row */}
            <div style={{
              background: 'var(--surface2)', borderRadius: 14, padding: '14px 16px',
              width: '100%', display: 'flex', justifyContent: 'space-between',
              fontSize: 13,
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Your balance</span>
              <span style={{ fontWeight: 700, color: 'var(--green)' }}>$18,000.00 (unchanged)</span>
            </div>

            {/* Actions */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn-primary"
                onClick={() => {
                  setStep('bank-details')
                  setData(prev => ({ ...prev, routingNumber: '', accountNumber: '' }))
                }}
              >
                ✏️ Update Bank Details & Retry
              </button>
              <button
                onClick={onBack}
                style={{
                  background: 'transparent', border: '1.5px solid var(--border)',
                  borderRadius: 14, padding: 14, fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.85); opacity: 0.9; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
