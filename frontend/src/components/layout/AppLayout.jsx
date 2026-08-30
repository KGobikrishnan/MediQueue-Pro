import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { ROLES } from '../../utils/constants';
import {
  Activity,
  Calendar,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Tv,
  UserCheck,
  UserPlus,
  Users,
  Building2,
  Bell,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const Header = () => {
  const { user, logout, loginAsRole } = useAuth();
  const { resetDemoData } = useQueue();
  const navigate = useNavigate();

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--primary-600), var(--teal-500))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Activity size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--primary-900)' }}>
              MediQueue <span style={{ color: 'var(--primary-500)' }}>Pro</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Enterprise OPD
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Smart Hospital Queue & OPD Orchestration
          </p>
        </div>
      </div>

      {/* Role Switcher Demo Bar (For instant testability) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#f1f5f9',
        padding: '0.25rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)',
        gap: '0.2rem'
      }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
          Role Demo:
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
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: isActive ? 'var(--primary-600)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Actions & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Open TV Display button */}
        <button
          onClick={() => window.open('/live-queue', '_blank')}
          title="Open Live Waiting Room TV Screen in New Tab"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: '#38bdf8',
            border: '1px solid #334155',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <Tv size={16} />
          <span>Launch TV Display</span>
        </button>

        {/* Reset State Tool */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo queues and consultation data to initial seed?')) {
              resetDemoData();
            }
          }}
          title="Reset Demo Data"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.45rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <RefreshCw size={16} />
        </button>

        {/* Profile Card */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={user.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-300)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--primary-700)', fontWeight: 600 }}>{user.role}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                padding: '0.2rem',
                marginLeft: '0.3rem'
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'var(--primary-600)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 1rem',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const getNavLinks = () => {
    switch (role) {
      case ROLES.DOCTOR:
        return [
          { to: '/doctor/consultation', label: 'Consultation Room', icon: Stethoscope, badge: 'Live' },
          { to: '/doctor/prescription', label: 'Rx Prescription Builder', icon: FileText },
          { to: '/doctor/schedule', label: 'My Schedule & Slots', icon: Calendar }
        ];
      case ROLES.RECEPTIONIST:
        return [
          { to: '/reception/walk-in', label: 'Walk-in & Triage Entry', icon: UserPlus, badge: 'Fast' },
          { to: '/reception/queue', label: 'Queue Manager Desk', icon: ClipboardList }
        ];
      case ROLES.PATIENT:
        return [
          { to: '/patient/dashboard', label: 'My Active Token', icon: LayoutDashboard },
          { to: '/patient/book', label: 'Book OPD Appointment', icon: Calendar },
          { to: '/patient/prescriptions', label: 'My Prescriptions (PDF)', icon: FileText }
        ];
      case ROLES.ADMIN:
        return [
          { to: '/admin/analytics', label: 'OPD Executive Analytics', icon: LayoutDashboard },
          { to: '/admin/doctors', label: 'Doctor Management', icon: Users },
          { to: '/admin/departments', label: 'Department Configs', icon: Building2 }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.85rem',
      justifyContent: 'space-between',
      minHeight: 'calc(100vh - 65px)'
    }}>
      <div>
        <div style={{
          padding: '0.65rem 0.85rem',
          marginBottom: '1rem',
          background: 'var(--primary-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--primary-100)'
        }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--primary-700)', letterSpacing: '0.05em' }}>
            Current Workplace
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)' }}>
            {user.role === ROLES.DOCTOR ? `${user.deptName || 'Cardiology'} (${user.roomNo || 'Room 204'})` : user.title || 'General OPD'}
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  background: isActive ? 'var(--primary-600)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={19} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    background: '#ef4444',
                    color: '#ffffff'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Status Footnote */}
      <div style={{
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        background: '#f8fafc',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>WebSocket Sync Active</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          STOMP / Broadcast channel synced across tabs.
        </div>
      </div>
    </aside>
  );
};
