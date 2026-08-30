import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { Activity, ShieldCheck, Stethoscope, UserCheck, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthPage = () => {
  const { loginAsRole, loginCustom } = useAuth();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.DOCTOR);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    loginCustom(email, password, selectedRole);
    redirectToRole(selectedRole);
  };

  const handleQuickDemoLogin = (roleKey) => {
    loginAsRole(roleKey);
    redirectToRole(roleKey);
  };

  const redirectToRole = (role) => {
    switch (role) {
      case ROLES.DOCTOR:
        navigate('/doctor/consultation');
        break;
      case ROLES.RECEPTIONIST:
        navigate('/reception/walk-in');
        break;
      case ROLES.PATIENT:
        navigate('/patient/dashboard');
        break;
      case ROLES.ADMIN:
        navigate('/admin/analytics');
        break;
      default:
        navigate('/patient/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 20%, #e0f2fe 0%, #f8fafc 90%)',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1020px',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Left Side: Hospital Value & 1-Click Role Login Cards */}
        <div style={{
          background: 'linear-gradient(145deg, #0b4175, #072a4e)',
          color: '#ffffff',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '0.45rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex'
              }}>
                <Activity size={26} color="#38bdf8" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                MediQueue <span style={{ color: '#38bdf8' }}>Pro</span>
              </h2>
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.85rem' }}>
              Enterprise Hospital OPD & Live Queue Orchestration
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.8rem', lineHeight: 1.5 }}>
              Experience zero-latency WebSocket queue synchronization, dynamic triage prioritization, digital prescriptions, and waiting-room TV displays.
            </p>

            {/* Instant 1-Click Role Launchers */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38bdf8', marginBottom: '0.75rem' }}>
                ⚡ 1-Click Instant Demo Login (Click Any Role)
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  {
                    role: ROLES.DOCTOR,
                    title: 'Doctor Portal',
                    subtitle: 'Consultation & Rx',
                    icon: Stethoscope,
                    color: '#0284c7'
                  },
                  {
                    role: ROLES.RECEPTIONIST,
                    title: 'Reception Desk',
                    subtitle: 'Triage & Token Gen',
                    icon: UserCheck,
                    color: '#0d9488'
                  },
                  {
                    role: ROLES.PATIENT,
                    title: 'Patient Tracker',
                    subtitle: 'Live Token & Slot Booking',
                    icon: Users,
                    color: '#8b5cf6'
                  },
                  {
                    role: ROLES.ADMIN,
                    title: 'Hospital Admin',
                    subtitle: 'Analytics & Rosters',
                    icon: ShieldCheck,
                    color: '#f59e0b'
                  }
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.role}
                      onClick={() => handleQuickDemoLogin(card.role)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.07)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Icon size={18} color="#38bdf8" />
                        <ArrowRight size={14} color="#94a3b8" />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{card.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{card.subtitle}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <CheckCircle2 size={15} color="#22c55e" />
            <span>Multi-tab Broadcast Live Sync Enabled</span>
          </div>
        </div>

        {/* Right Side: Custom Form */}
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              {isLoginTab ? 'Sign in to your account' : 'Create an OPD account'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Enter your credentials or select a role above for instant demo.
            </p>
          </div>

          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                Work Email or Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. dr.sarah@mediqueue.pro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                Role Category
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.9rem',
                  background: '#ffffff'
                }}
              >
                <option value={ROLES.DOCTOR}>Doctor (Consultation & Prescription)</option>
                <option value={ROLES.RECEPTIONIST}>Receptionist (Registration & Queue Desk)</option>
                <option value={ROLES.PATIENT}>Patient (Token Tracker & Booking)</option>
                <option value={ROLES.ADMIN}>Hospital Administrator (Analytics & Config)</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {isLoginTab ? 'Sign In to Portal' : 'Register OPD Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLoginTab(!isLoginTab)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary-600)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {isLoginTab ? "Don't have an account? Register here" : 'Already registered? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
