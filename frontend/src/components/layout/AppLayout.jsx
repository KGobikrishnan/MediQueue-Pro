import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { ROLES, TOKEN_STATUS } from '../../utils/constants';
import { ConnectionBanner } from '../common/ConnectionBanner';
import { ScreenLockModal } from '../common/ScreenLockModal';
import {
  Activity,
  Calendar,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Tv,
  UserPlus,
  Users,
  Building2,
  Lock,
  Wifi,
  Keyboard,
  ShieldCheck,
  Flame,
  Volume2,
  ChevronRight,
  BellRing,
  FolderHeart
} from 'lucide-react';

export const AppLayout = ({ children }) => {
  const { user, logout, loginAsRole, lockScreenNow } = useAuth();
  const { queues, lastCalledToken, isOnline, isWsConnected, recallPatient, callNextPatient } = useQueue();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRailExpanded, setIsRailExpanded] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Global Keyboard Shortcuts (F1 = Walk-in, F2 = Call Next, Esc = Shortcuts Modal, L = Lock)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid triggering when focused inside inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.key === 'F1') {
        e.preventDefault();
        navigate('/reception/walk-in');
      } else if (e.key === 'F2') {
        e.preventDefault();
        if (user?.role === ROLES.DOCTOR || user?.role === ROLES.RECEPTIONIST) {
          callNextPatient(user?.id || 'doc-1');
        }
      } else if (e.key === 'F3') {
        e.preventDefault();
        window.open('/live-queue', '_blank');
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        lockScreenNow();
      } else if (e.key === '?') {
        setShowShortcutsModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, navigate, callNextPatient, lockScreenNow]);

  const getNavLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case ROLES.DOCTOR:
        return [
          { to: '/doctor/consultation', label: 'Consultation Room', icon: Stethoscope, shortcut: 'F2' },
          { to: '/doctor/prescription', label: 'Rx Builder', icon: FileText },
          { to: '/doctor/schedule', label: 'Schedule & Slots', icon: Calendar }
        ];
      case ROLES.RECEPTIONIST:
        return [
          { to: '/reception/walk-in', label: 'Walk-In & Triage', icon: UserPlus, shortcut: 'F1' },
          { to: '/reception/queue', label: 'Queue Manager', icon: ClipboardList }
        ];
      case ROLES.PATIENT:
        return [
          { to: '/patient/dashboard', label: 'My Token', icon: LayoutDashboard },
          { to: '/patient/book', label: 'Book OPD Slot', icon: Calendar },
          { to: '/patient/prescriptions', label: 'Prescriptions', icon: FileText }
        ];
      case ROLES.ADMIN:
        return [
          { to: '/admin/analytics', label: 'Executive Analytics', icon: LayoutDashboard },
          { to: '/admin/doctors', label: 'Doctor Management', icon: Stethoscope },
          { to: '/admin/patients', label: 'Patient Directory & EHR', icon: Users, badge: 'EHR' },
          { to: '/admin/departments', label: 'Departments', icon: Building2 }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  // Context Panel Data
  const emergencyTokens = queues.filter((q) => q.priority === 'EMERGENCY' && q.status === TOKEN_STATUS.WAITING);
  const activeInConsultation = queues.filter((q) => q.status === TOKEN_STATUS.IN_CONSULTATION);
  const totalWaiting = queues.filter((q) => q.status === TOKEN_STATUS.WAITING).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-base)' }}>
      {/* Realtime Connection Status Banner */}
      <ConnectionBanner isOnline={isOnline} isConnected={isWsConnected} onRetry={() => window.location.reload()} />
      <ScreenLockModal />

      {/* Shortcuts Modal */}
      {showShortcutsModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999
          }}
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            style={{
              background: 'var(--surface-01)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--shadow-raised)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Keyboard size={20} color="var(--brand-primary)" />
              Enterprise Keyboard Accelerators
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Used by hospital front-desk & triage staff for sub-second rapid entry:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { kbd: 'F1', desc: 'Rapid Walk-in Patient Registration' },
                { kbd: 'F2', desc: 'Call Next Waiting Patient' },
                { kbd: 'F3', desc: 'Launch Waiting Room TV Display' },
                { kbd: 'Ctrl + L', desc: 'Lock Workstation Immediately' },
                { kbd: '?', desc: 'Show this keyboard shortcuts cheat-sheet' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.desc}</span>
                  <span className="kbd-shortcut">{item.kbd}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowShortcutsModal(false)}
              style={{
                marginTop: '1.25rem',
                width: '100%',
                padding: '0.65rem',
                background: 'var(--brand-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700
              }}
            >
              Close Accelerators
            </button>
          </div>
        </div>
      )}

      {/* Top Application Header */}
      <header style={{
        height: '56px',
        background: 'var(--surface-01)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        zIndex: 30
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Activity size={19} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              MediQueue <span style={{ color: 'var(--brand-primary)' }}>Pro</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              fontFamily: 'var(--font-data)',
              background: 'var(--brand-light)',
              color: 'var(--brand-primary)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px'
            }}>
              MNC-OPD v2.4
            </span>
          </div>
        </div>

        {/* 1-Click Role Switcher Demo Ribbon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface-02)',
          padding: '0.2rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          gap: '0.2rem'
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 0.4rem' }}>
            Role:
          </span>
          {[
            { role: ROLES.DOCTOR, label: 'Doctor', path: '/doctor/consultation' },
            { role: ROLES.RECEPTIONIST, label: 'Reception', path: '/reception/walk-in' },
            { role: ROLES.PATIENT, label: 'Patient', path: '/patient/dashboard' },
            { role: ROLES.ADMIN, label: 'Admin', path: '/admin/analytics' }
          ].map((item) => {
            const isActive = user?.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => {
                  loginAsRole(item.role);
                  navigate(item.path);
                }}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: isActive ? 'var(--brand-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Tools: Keyboard Shortcuts, TV Launcher, Screen Lock, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => setShowShortcutsModal(true)}
            title="Keyboard Shortcuts (?)"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <Keyboard size={15} />
            <span className="kbd-shortcut">?</span>
          </button>

          <button
            onClick={() => window.open('/live-queue', '_blank')}
            title="Launch Fullscreen Waiting Room TV Display (F3)"
            style={{
              background: '#0f172a',
              color: '#38bdf8',
              border: '1px solid #334155',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            <Tv size={15} />
            <span>TV Display</span>
            <span className="kbd-shortcut" style={{ background: '#1e293b', color: '#94a3b8', borderColor: '#334155' }}>F3</span>
          </button>

          <button
            onClick={lockScreenNow}
            title="Lock Workstation (Ctrl + L)"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.6rem',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <Lock size={15} />
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--brand-primary)' }}
              />
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Logout"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 3-Column Contextual Architecture: [Nav Rail 48px] + [Primary Workspace flex-1] + [Context Panel 320px] */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 56px)' }}>
        {/* 1. Nav Rail (48px Icon Rail expanding on hover to 220px) */}
        <aside
          className="nav-rail no-print"
          onMouseEnter={() => setIsRailExpanded(true)}
          onMouseLeave={() => setIsRailExpanded(false)}
          style={{
            width: isRailExpanded ? '230px' : '52px',
            transition: 'width 180ms cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'var(--surface-01)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '0.75rem 0.35rem',
            zIndex: 20
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    background: isActive ? 'var(--brand-light)' : 'transparent',
                    color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 800 : 500,
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  })}
                >
                  <div style={{ minWidth: '22px', display: 'flex', justifyContent: 'center' }}>
                    <Icon size={19} />
                  </div>
                  {isRailExpanded && (
                    <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {item.label}
                    </span>
                  )}
                  {isRailExpanded && item.badge && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      background: 'var(--brand-primary)',
                      color: '#ffffff'
                    }}>
                      {item.badge}
                    </span>
                  )}
                  {isRailExpanded && item.shortcut && (
                    <span className="kbd-shortcut">{item.shortcut}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div style={{ textAlign: 'center', padding: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              margin: '0 auto',
              title: 'Broadcast Synchronizer Online'
            }} />
          </div>
        </aside>

        {/* 2. Primary Workspace (flex-1) */}
        <main
          tabIndex={-1}
          style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            background: 'var(--surface-base)'
          }}
        >
          {children}
        </main>

        {/* 3. Context Panel (320px — Always shows 'What is Happening Now') */}
        <aside
          className="context-panel no-print"
          style={{
            width: '310px',
            background: 'var(--surface-01)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            overflowY: 'auto'
          }}
        >
          {/* Emergency / Critical Watcher */}
          {emergencyTokens.length > 0 && (
            <div className="emergency-pulse" style={{
              background: 'var(--triage-emergency-bg)',
              border: '1px solid var(--triage-emergency-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--triage-emergency)', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <Flame size={18} />
                <span>TRIAGE CRITICAL ALERT</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#991b1b', margin: 0 }}>
                {emergencyTokens[0]?.tokenNumber} ({emergencyTokens[0]?.patientName}) requires immediate room admission.
              </p>
            </div>
          )}

          {/* Quick Pulse: Now in Consultation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ACTIVE ROOMS ({activeInConsultation.length})
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {totalWaiting} Waiting
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeInConsultation.map((tok) => (
                <div
                  key={tok.id}
                  style={{
                    background: 'var(--surface-02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-data)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--brand-primary)' }}>
                      {tok.tokenNumber}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {tok.patientName}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {tok.roomNo}
                    </div>
                    <button
                      onClick={() => recallPatient(tok)}
                      title="Re-announce"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--brand-primary)',
                        padding: '0.1rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {activeInConsultation.length === 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  No active consultation right now.
                </div>
              )}
            </div>
          </div>

          {/* Quick Doctor Consultation Speed Dial */}
          {user?.role === ROLES.DOCTOR && (
            <div style={{
              background: 'var(--brand-light)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Consultant Quick Action
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Press <span className="kbd-shortcut">F2</span> or click below to advance OPD queue.
              </p>
              <button
                onClick={() => callNextPatient(user?.id || 'doc-1')}
                style={{
                  width: '100%',
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <BellRing size={15} />
                <span>Call Next Patient</span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
