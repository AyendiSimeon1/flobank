'use client'
import { useState } from 'react'

const transactions = [
  { id: 1, name: 'Eva Novak', sub: 'Received', amount: +5710.20, icon: '👩', when: 'Today', positive: true },
  { id: 2, name: 'Binance', sub: 'Received', amount: +714.00, icon: '🟡', when: 'Today', positive: true },
  { id: 3, name: 'Henrik Jansen', sub: 'Received', amount: +428.00, icon: '👨', when: 'Yesterday', positive: true },
  { id: 4, name: 'Multiplex', sub: 'Paid', amount: -124.55, icon: '🔴', when: 'Yesterday', positive: false },
  { id: 5, name: 'Megogo', sub: '1 min ago', amount: -24.99, icon: '🟢', when: 'Latest', positive: false },
]

const chartData = [3,5,4,7,6,8,5,4,6,12,9,7,8,6,5,7,4,6,5,3]
const PEAK = 12

function DotColumn({ height, active }: { height: number; active: boolean }) {
  const maxDots = 12
  const filled = Math.round((height / PEAK) * maxDots)
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: maxDots }).map((_, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i < filled ? (active ? '#1a1f0e' : '#c8d8b0') : 'transparent',
        }} />
      ))}
    </div>
  )
}

export default function Dashboard({ onTransfer }: { onTransfer: () => void }) {
  const [hideBalance, setHideBalance] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const grouped: Record<string, typeof transactions> = {}
  transactions.forEach(t => {
    if (!grouped[t.when]) grouped[t.when] = []
    grouped[t.when].push(t)
  })

  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      paddingBottom: 90,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #b8d930, #7ab318)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: 'white',
            }}>S</div>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Hi, Sofia!</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'var(--surface)', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}>🔔</button>
            <button style={{ background: 'var(--surface)', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}>📊</button>
          </div>
        </div>

        {/* Balance Card */}
        <div style={{
          background: 'var(--accent)',
          borderRadius: 24,
          padding: '20px 20px 16px',
          marginBottom: 16,
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>USD</span>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: 0.6 }}
            >{hideBalance ? '👁️' : '🙈'}</button>
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 12 }}>1 USD = EUR 0.95 · GBP 0.79</div>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1 }}>
            {hideBalance ? '••••••••' : '$18,000.00'}
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 8, color: 'var(--green)' }}>+$421.03</div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 20 }}>
            {[
              { icon: '↗️', label: 'Pay' },
              { icon: '↔️', label: 'Transfer', action: onTransfer },
              { icon: '↙️', label: 'Receive' },
            ].map(a => (
              <button
                key={a.label}
                onClick={a.action}
                style={{
                  background: 'rgba(255,255,255,0.45)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '10px 8px',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  transition: 'background 0.2s',
                }}
              >
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Currency row */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Currency</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { symbol: '€', name: 'Euro', rate: '0.97' },
            { symbol: '£', name: 'British pound', rate: '0.82' },
          ].map(c => (
            <div key={c.name} className="card" style={{ flex: 1, padding: '12px 14px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-muted)' }}>{c.symbol}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{c.name}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{c.rate}</div>
            </div>
          ))}
          <div style={{
            background: 'var(--text)',
            color: 'white',
            borderRadius: 16,
            padding: '12px 14px',
            flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 13, fontWeight: 600, gap: 4, textAlign: 'center',
          }}>
            <span style={{ fontSize: 20 }}>+</span>
            <span>Add Currency</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: '0 20px 16px' }}>
        <div className="card" style={{ padding: '18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Total Rate</span>
            <button style={{
              background: 'var(--surface2)', border: 'none', borderRadius: 8,
              padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>Yearly ↓</button>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Tooltip on peak */}
            <div style={{
              position: 'absolute', top: -8, left: '45%',
              background: 'var(--accent)',
              borderRadius: 10, padding: '6px 10px',
              fontSize: 12, fontWeight: 700,
              whiteSpace: 'nowrap', zIndex: 2,
            }}>
              $118,952.34<br />
              <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7 }}>Total Spend</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, marginTop: 28, height: 80 }}>
              {chartData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 2 }}>
                  {Array.from({ length: Math.round((v / PEAK) * 10) }).map((_, j) => (
                    <div key={j} style={{
                      width: '100%', height: 5, borderRadius: 3,
                      background: i === 9 ? '#1a1f0e' : '#c8d8b0',
                    }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div style={{ padding: '0 20px', flex: 1 }}>
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{group}</span>
              {group === 'Latest' && (
                <a href="#" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>See All</a>
              )}
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {items.map((tx, i) => (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--surface2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    flexShrink: 0,
                  }}>{tx.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{tx.sub} ✓</div>
                  </div>
                  <div style={{
                    fontWeight: 700, fontSize: 15,
                    color: tx.positive ? 'var(--green)' : 'var(--red)',
                    flexShrink: 0,
                  }}>
                    {tx.positive ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '12px 20px 24px',
        zIndex: 50,
      }}>
        {[
          { icon: '🕐', id: 'history' },
          { icon: '🏠', id: 'home' },
          { icon: '👤', id: 'profile' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: tab.id === activeTab ? 'var(--text)' : 'var(--surface2)',
              border: 'none',
              borderRadius: '50%',
              width: 44, height: 44,
              fontSize: 18, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >{tab.icon}</button>
        ))}
      </div>
    </div>
  )
}
