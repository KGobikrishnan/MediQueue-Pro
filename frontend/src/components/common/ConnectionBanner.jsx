import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const ConnectionBanner = ({ isOnline, isConnected, onRetry }) => {
  if (isOnline && isConnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: isOnline ? '#b45309' : 'var(--triage-emergency)',
        color: '#ffffff',
        padding: '0.45rem 1rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        boxShadow: 'var(--shadow-subtle)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <WifiOff size={16} />
        <span>
          {!isOnline
            ? 'Offline Mode Active — Token queue cached in local storage. Syncing on reconnect.'
            : 'WebSocket Reconnecting — Live token broadcast interrupted. Retrying...'}
        </span>
      </div>

      <button
        onClick={onRetry}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: '#ffffff',
          padding: '0.2rem 0.6rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          cursor: 'pointer'
        }}
      >
        <RefreshCw size={12} />
        <span>Retry Connection</span>
      </button>
    </div>
  );
};
