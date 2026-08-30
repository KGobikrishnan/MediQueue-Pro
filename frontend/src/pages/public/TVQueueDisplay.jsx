import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DEPARTMENTS, TOKEN_STATUS } from '../../utils/constants';
import { playHospitalChime } from '../../utils/audioHelper';
import {
  Tv,
  Volume2,
  VolumeX,
  Clock,
  Activity,
  HeartPulse,
  Stethoscope,
  Maximize,
  Minimize,
  QrCode
} from 'lucide-react';

export const TVQueueDisplay = () => {
  const { queues, doctors, lastCalledToken } = useQueue();
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Group active & waiting queues by department
  const activeConsultations = queues.filter((q) => q.status === TOKEN_STATUS.IN_CONSULTATION);
  const nextInQueue = queues
    .filter((q) => q.status === TOKEN_STATUS.WAITING)
    .sort((a, b) => {
      const pMap = { EMERGENCY: 3, SENIOR: 2, NORMAL: 1 };
      const pDiff = (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
      if (pDiff !== 0) return pDiff;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #020617 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '1.25rem 2rem',
      overflow: 'hidden'
    }}>
      {/* Top TV Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '1rem',
        marginBottom: '1.25rem'
      }}>
        {/* Hospital Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
            padding: '0.65rem',
            borderRadius: '12px',
            display: 'flex',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <Activity size={32} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
              MediQueue <span style={{ color: '#38bdf8' }}>Pro</span> • OPD LIVE QUEUE
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#4ade80',
                background: 'rgba(74, 222, 128, 0.15)',
                padding: '0.15rem 0.6rem',
                borderRadius: '999px',
                border: '1px solid rgba(74, 222, 128, 0.3)'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                REALTIME BROADCAST ACTIVE
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Waiting Area Central Display</span>
            </div>
          </div>
        </div>

        {/* Live Clock & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '0.5rem 1.25rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#f8fafc', letterSpacing: '0.05em' }}>
              {currentTime.toLocaleTimeString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <button
            onClick={() => {
              playHospitalChime();
              setIsAudioAllowed(!isAudioAllowed);
            }}
            style={{
              background: isAudioAllowed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${isAudioAllowed ? '#22c55e' : '#ef4444'}`,
              color: isAudioAllowed ? '#4ade80' : '#f87171',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            {isAudioAllowed ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{isAudioAllowed ? 'Voice & Chime On' : 'Unmute Voice'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '0.65rem',
              borderRadius: '10px',
              display: 'flex'
            }}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      {/* Main Grid: Active Calling Token Spotlight + Department Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        {/* Left Column: Currently Calling Tokens across Rooms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <HeartPulse size={22} color="#38bdf8" />
              NOW CONSULTING (PLEASE ENTER ROOM)
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {activeConsultations.length} Active Doctor Rooms
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: activeConsultations.length > 2 ? '1fr 1fr' : '1fr',
            gap: '1rem',
            overflowY: 'auto'
          }}>
            {activeConsultations.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                  borderRadius: '18px',
                  border: item.priority === 'EMERGENCY' ? '2px solid #ef4444' : '2px solid #0284c7',
                  padding: '1.4rem',
                  boxShadow: item.priority === 'EMERGENCY' ? '0 0 25px rgba(239, 68, 68, 0.35)' : '0 0 25px rgba(2, 132, 199, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {item.priority === 'EMERGENCY' && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    letterSpacing: '0.05em'
                  }}>
                    EMERGENCY TRIAGE
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.department?.toUpperCase()} • {item.roomNo}
                  </div>

                  <div style={{
                    fontSize: '3.4rem',
                    fontWeight: 900,
                    fontFamily: 'JetBrains Mono',
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                    margin: '0.2rem 0',
                    lineHeight: 1
                  }}>
                    {item.tokenNumber}
                  </div>

                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {item.patientName}
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '0.85rem',
                  marginTop: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Stethoscope size={18} color="#38bdf8" />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#cbd5e1' }}>
                      {item.doctorName}
                    </span>
                  </div>
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    PROCEED NOW →
                  </div>
                </div>
              </div>
            ))}

            {activeConsultations.length === 0 && (
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                color: '#94a3b8'
              }}>
                <Clock size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <h3>All doctor consultation rooms currently waiting</h3>
                <p style={{ fontSize: '0.85rem' }}>Doctors will call next tokens shortly.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Queue Matrix & Mobile QR */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                UPCOMING QUEUE ORDER (STANDBY)
              </h2>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fbbf24',
                background: 'rgba(251, 191, 36, 0.15)',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px'
              }}>
                {nextInQueue.length} In Waiting
              </span>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '55vh', overflowY: 'auto' }}>
              {nextInQueue.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: item.priority === 'EMERGENCY' ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                      width: '20px'
                    }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.1rem', color: '#38bdf8' }}>
                        {item.tokenNumber}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                        {item.patientName} • {item.department?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {item.roomNo}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {item.doctorName}
                    </div>
                  </div>
                </div>
              ))}

              {nextInQueue.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No pending patients in waiting queue.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Banner: QR Code & Mobile Tracking */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(6, 182, 212, 0.15))',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              color: '#0f172a'
            }}>
              <QrCode size={42} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff' }}>
                Track Your Token on Mobile
              </div>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: '0.15rem 0 0 0' }}>
                Scan the QR code or visit <strong>mediqueuepro.org/track</strong> with your phone number to get live SMS & buzzer alerts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
