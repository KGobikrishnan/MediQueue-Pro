import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { TOKEN_STATUS } from '../../utils/constants';
import { generateTokenSlipPDF } from '../../utils/pdfGenerator';
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  HeartPulse,
  Printer,
  Sparkles,
  Stethoscope,
  Users,
  CheckCircle2
} from 'lucide-react';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { queues, prescriptions } = useQueue();
  const navigate = useNavigate();

  // Find active token associated with patient phone or name
  const userPhone = user?.phone || '9840112345';
  const userName = user?.name || 'Karthik Ramanathan';

  const myToken = queues.find(
    (q) => (q.phone === userPhone || q.patientName === userName) && (q.status === TOKEN_STATUS.WAITING || q.status === TOKEN_STATUS.IN_CONSULTATION)
  ) || queues[0]; // fallback to first token for demonstration

  // Calculate position in line for this token
  const tokensAhead = myToken
    ? queues.filter(
        (q) =>
          q.doctorId === myToken.doctorId &&
          q.status === TOKEN_STATUS.WAITING &&
          new Date(q.createdAt) < new Date(myToken.createdAt)
      ).length
    : 0;

  const estimatedWaitMin = myToken?.status === TOKEN_STATUS.IN_CONSULTATION ? 0 : (tokensAhead + 1) * 12;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Welcome & Quick Action Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0b4175, #025cb0)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800 }}>
              OPD PATIENT PORTAL
            </span>
            <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>Verified Mobile: {userPhone}</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
            Hello, {userName}
          </h1>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#e0f2fe' }}>
            Live status of your hospital appointment, token queue position, and prescriptions.
          </p>
        </div>

        <button
          onClick={() => navigate('/patient/book')}
          style={{
            background: '#ffffff',
            color: '#0b4175',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1.5rem',
            fontWeight: 800,
            fontSize: '0.95rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Calendar size={18} />
          <span>Book New OPD Slot</span>
        </button>
      </div>

      {/* Main Grid: Active Live Token Tracker + Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        {/* Left Side: Live Token Card */}
        {myToken ? (
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HeartPulse size={24} color="var(--primary-600)" />
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    Your Active OPD Token
                  </span>
                </div>

                {myToken.status === TOKEN_STATUS.IN_CONSULTATION ? (
                  <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
                    🔔 IT'S YOUR TURN (ENTER ROOM)
                  </span>
                ) : (
                  <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 800, fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
                    IN QUEUE • STANDBY
                  </span>
                )}
              </div>

              {/* Big Token Display */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid var(--primary-200)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  TOKEN NUMBER
                </div>
                <div style={{ fontSize: '3.6rem', fontWeight: 900, fontFamily: 'JetBrains Mono', color: 'var(--primary-800)', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
                  {myToken.tokenNumber}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {myToken.department?.toUpperCase()} • {myToken.doctorName}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Proceed to: <strong>{myToken.roomNo}</strong>
                </div>
              </div>

              {/* Queue Position & Estimated Wait Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PATIENTS AHEAD OF YOU</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {myToken.status === TOKEN_STATUS.IN_CONSULTATION ? '0 (Now Inside)' : tokensAhead}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ESTIMATED WAIT TIME</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-600)', marginTop: '0.2rem' }}>
                    ~{estimatedWaitMin} Mins
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => generateTokenSlipPDF(myToken)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'var(--primary-600)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                <Printer size={18} />
                <span>Download Token Slip PDF</span>
              </button>

              <button
                onClick={() => window.open('/live-queue', '_blank')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#f1f5f9',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                <span>Live TV Tracker</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#ffffff', padding: '3rem', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
            <h3>No active token currently.</h3>
            <button onClick={() => navigate('/patient/book')}>Book an Appointment</button>
          </div>
        )}

        {/* Right Side: Quick History & Recent Prescriptions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Recent Digital Prescriptions
              </h2>
              <button
                onClick={() => navigate('/patient/prescriptions')}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary-600)', fontSize: '0.75rem', fontWeight: 700 }}
              >
                View All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {prescriptions.slice(0, 3).map((rx) => (
                <div
                  key={rx.id}
                  style={{
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {rx.diagnosis}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {rx.doctorName} • {rx.date}
                    </div>
                  </div>
                  <FileText size={18} color="var(--primary-600)" />
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 800, fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} />
              <span>SMS Alert Activated</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#15803d', margin: '0.3rem 0 0 0' }}>
              We will send you an SMS buzzer 10 minutes before your token is called by the doctor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
