import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const ScreenLockModal = () => {
  const { isScreenLocked, unlockScreen, user } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isScreenLocked) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    const success = unlockScreen(pin);
    if (!success) {
      setError(true);
      setPin('');
    } else {
      setError(false);
      setPin('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lock-modal-title"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1.5rem'
      }}
    >
      <div style={{
        background: 'var(--surface-01)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--brand-light)',
          color: 'var(--brand-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Lock size={30} />
        </div>

        <h2 id="lock-modal-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Workstation Auto-Locked
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Session locked due to inactivity to protect patient privacy (HIPAA / NABH standard). Enter your 4-digit PIN (Default: <strong>1234</strong>) or click bypass.
        </p>

        <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              maxLength={6}
              autoFocus
              placeholder="Enter PIN (1234)"
              value={pin}
              onChange={(e) => {
                setError(false);
                setPin(e.target.value);
              }}
              aria-label="Security PIN"
              style={{
                width: '100%',
                textAlign: 'center',
                letterSpacing: '0.4em',
                fontSize: '1.4rem',
                fontWeight: 800,
                fontFamily: 'var(--font-data)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: error ? '2px solid var(--triage-emergency)' : '1px solid var(--border-strong)',
                background: error ? 'var(--triage-emergency-bg)' : '#ffffff'
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: '0.75rem', color: 'var(--triage-emergency)', fontWeight: 700 }}>
              Incorrect PIN. Use default: 1234
            </div>
          )}

          <button
            type="submit"
            style={{
              background: 'var(--brand-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <span>Unlock Workstation</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
