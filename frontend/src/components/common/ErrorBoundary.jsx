import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MediQueue Clinical System Caught Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface-base)',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--surface-01)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-raised)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--triage-emergency-bg)',
              color: 'var(--triage-emergency)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Clinical Module Recovered
            </h1>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              MediQueue Pro isolated a runtime exception to preserve data integrity and active queue states.
            </p>

            {this.state.error && (
              <div style={{
                background: '#f8fafc',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-data)',
                color: '#64748b',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                border: '1px solid var(--border-subtle)'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              style={{
                background: 'var(--brand-primary)',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={16} />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
