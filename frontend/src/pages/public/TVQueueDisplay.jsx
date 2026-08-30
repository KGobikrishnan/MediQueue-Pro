import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import { playHospitalChime } from '../../utils/audioHelper';
import {
  Volume2,
  VolumeX,
  Clock,
  Activity,
  HeartPulse,
  Stethoscope,
  Maximize,
  Minimize,
  QrCode,
  Flame,
  Radio
} from 'lucide-react';

export const TVQueueDisplay = () => {
  const { queues } = useQueue();
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

  const activeConsultations = queues.filter((q) => q.status === 'IN_CONSULTATION');
  const nextInQueue = queues
    .filter((q) => q.status === 'WAITING')
    .sort((a, b) => {
      const pMap = { EMERGENCY: 3, SENIOR: 2, NORMAL: 1 };
      const pDiff = (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
      if (pDiff !== 0) return pDiff;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const featuredToken = activeConsultations[0];

  return (
    <div className="tv-scanline-container" style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #090d16 0%, #030712 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-ui)',
      padding: '1.5rem 2.5rem',
      overflow: 'hidden'
    }}>
      {/* Top TV Bar: Hospital Branding + Clock + Audio controls */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'var(--brand-primary)',
            padding: '0.6rem',
            borderRadius: '12px',
            boxShadow: '0 0 25px rgba(0, 102, 204, 0.5)',
            display: 'flex'
          }}>
            <Activity size={32} color="#ffffff" />
          </div>

          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
              MEDIQUEUE <span style={{ color: '#38bdf8' }}>PRO</span> • OPD LIVE BROADCAST
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.2rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#4ade80',
                background: 'rgba(74, 222, 128, 0.12)',
                padding: '0.15rem 0.55rem',
                borderRadius: '999px',
                border: '1px solid rgba(74, 222, 128, 0.3)'
              }}>
                <Radio size={12} />
                CENTRAL WAITING ROOM FEED
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Automated Voice Chime Synced
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Clock & Fullscreen Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '0.4rem 1.25rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-data)', color: '#f8fafc', letterSpacing: '0.05em' }}>
              {currentTime.toLocaleTimeString()}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <button
            onClick={() => {
              playHospitalChime(false);
              setIsAudioAllowed(!isAudioAllowed);
            }}
            aria-label="Toggle audio chime"
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
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {isAudioAllowed ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{isAudioAllowed ? 'Voice Chime ON' : 'Unmute Chime'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '0.65rem',
              borderRadius: '10px',
              display: 'flex',
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </header>

      {/* Main Grid: Cinema-Grade Spotlight + Live Waiting Standby */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
        {/* Left: Huge NOW CONSULTING Hero Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ▶ NOW CONSULTING (PROCEED TO ROOM)
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {activeConsultations.length} Active Consultations
            </span>
          </div>

          {featuredToken ? (
            <div
              className={featuredToken.priority === 'EMERGENCY' ? 'emergency-pulse' : ''}
              style={{
                background: 'linear-gradient(145deg, #131d33, #090e1a)',
                borderRadius: '24px',
                border: featuredToken.priority === 'EMERGENCY' ? '2.5px solid var(--triage-emergency)' : '2px solid var(--brand-primary)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                boxShadow: featuredToken.priority === 'EMERGENCY' ? 'var(--shadow-emergency)' : '0 0 35px rgba(0, 102, 204, 0.3)',
                position: 'relative'
              }}
            >
              {featuredToken.priority === 'EMERGENCY' && (
                <div style={{
                  position: 'absolute',
                  top: '18px',
                  right: '20px',
                  background: 'var(--triage-emergency)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Flame size={16} />
                  <span>EMERGENCY PRIORITY</span>
                </div>
              )}

              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {featuredToken.department?.toUpperCase()} • {featuredToken.roomNo}
                </div>

                {/* Big Spaced Letter Token */}
                <div className="token-cinema-number" style={{
                  color: '#ffffff',
                  margin: '0.6rem 0',
                  lineHeight: 1
                }}>
                  {featuredToken.tokenNumber}
                </div>

                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                  {featuredToken.patientName}
                </div>
              </div>

              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                paddingTop: '1.25rem',
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Stethoscope size={24} color="#38bdf8" />
                  <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#e2e8f0' }}>
                    {featuredToken.doctorName}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(56, 189, 248, 0.18)',
                  color: '#38bdf8',
                  padding: '0.45rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  letterSpacing: '0.04em'
                }}>
                  ENTER ROOM NOW ▶
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(19, 29, 51, 0.6)',
              borderRadius: '24px',
              padding: '4rem 2rem',
              textAlign: 'center',
              color: '#94a3b8',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={48} style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e2e8f0' }}>All OPD Rooms on Standby</h2>
              <p style={{ fontSize: '0.9rem' }}>Doctors will call next token shortly.</p>
            </div>
          )}
        </div>

        {/* Right: Upcoming Standby Queue Order */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '0.05em' }}>
                UPCOMING QUEUE ORDER
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#fbbf24',
                background: 'rgba(251, 191, 36, 0.15)',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px'
              }}>
                {nextInQueue.length} In Waiting
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '55vh', overflowY: 'auto' }}>
              {nextInQueue.map((tok, idx) => (
                <div
                  key={tok.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: tok.priority === 'EMERGENCY' ? '1.5px solid var(--triage-emergency)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.9rem', fontWeight: 800, color: '#94a3b8', width: '24px' }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-data)', fontWeight: 800, fontSize: '1.2rem', color: '#38bdf8' }}>
                        {tok.tokenNumber}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                        {tok.patientName} • {tok.department?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {tok.roomNo}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {tok.doctorName}
                    </div>
                  </div>
                </div>
              ))}

              {nextInQueue.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  No pending patients waiting in queue.
                </div>
              )}
            </div>
          </div>

          {/* Bottom QR Code Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.2), rgba(0, 194, 203, 0.2))',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              padding: '0.45rem',
              borderRadius: '10px',
              display: 'flex',
              color: '#0f172a'
            }}>
              <QrCode size={46} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                Track Live Queue On Your Phone
              </div>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: '0.2rem 0 0 0' }}>
                Scan or visit <strong>mediqueuepro.org/track</strong> with your token number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
