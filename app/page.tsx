'use client'
import { useState } from 'react'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import TransferFlow from '@/components/TransferFlow'

export type Screen = 'login' | 'dashboard' | 'transfer'

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      {screen === 'login' && <Login onLogin={() => setScreen('dashboard')} />}
      {screen === 'dashboard' && <Dashboard onTransfer={() => setScreen('transfer')} />}
      {screen === 'transfer' && <TransferFlow onBack={() => setScreen('dashboard')} />}
    </main>
  )
}
