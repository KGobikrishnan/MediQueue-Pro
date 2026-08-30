import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { TOKEN_STATUS } from '../../utils/constants';
import {
  Clock,
  HeartPulse,
  Flame,
  Volume2,
  FilePlus,
  CheckCircle2,
  SkipForward,
  Stethoscope,
  Activity,
  AlertCircle
} from 'lucide-react';

export const ConsultationRoom = () => {
  const { user } = useAuth();
  const { queues, callNextPatient, recallPatient, completePatient, markNoShow } = useQueue();
  const navigate = useNavigate();

  const doctorId = user?.id || 'doc-1';
  const doctorName = user?.name || 'Dr. Sarah Jenkins';

  const activeToken = queues.find(
    (q) => (q.doctorId === doctorId || q.doctorName === doctorName) && q.status === TOKEN_STATUS.IN_CONSULTATION
  );

  const waitingList = queues
    .filter((q) => (q.doctorId === doctorId || q.doctorName === doctorName) && q.status === TOKEN_STATUS.WAITING)
    .sort((a, b) => {
      const pMap = { EMERGENCY: 3, SENIOR: 2, NORMAL: 1 };
      const pDiff = (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
      if (pDiff !== 0) return pDiff;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  // Dynamic Consultation Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (activeToken) {
      const startTime = activeToken.calledAt ? new Date(activeToken.calledAt).getTime() : Date.now();
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));

      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeToken]);

  // Timer Color Dynamics (Normal < 10m, Amber 10-15m, Red > 15m)
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const timerColor = elapsedMinutes >= 15 ? 'var(--triage-emergency)' : elapsedMinutes >= 10 ? 'var(--triage-urgent)' : 'var(--brand-primary)';

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getBpStatus = (bpStr) => {
    try {
      const sys = parseInt(bpStr.split('/')[0], 10);
      if (sys >= 140) return { label: 'High Range', color: 'var(--triage-emergency)' };
      if (sys < 100) return { label: 'Low Range', color: 'var(--triage-urgent)' };
      return { label: 'Normal Range', color: 'var(--triage-routine)' };
    } catch {
      return { label: 'Standard', color: 'var(--text-muted)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Doctor Room Top Header */}
      <div style={{
        background: 'var(--surface-01)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.75rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex'
          }}>
            <Stethoscope size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {doctorName}
              </h1>
              <span style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                {user?.roomNo || 'Room 204'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Department of {user?.deptName || 'Cardiology'} • Active OPD Session
            </p>
          </div>
        </div>

        {/* Global Call Next Patient Button */}
        <button
          onClick={() => callNextPatient(doctorId)}
          style={{
            background: 'var(--brand-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer'
          }}
        >
          <span>Call Next Patient ({waitingList.length})</span>
          <span className="kbd-shortcut" style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff', borderColor: 'transparent' }}>F2</span>
        </button>
      </div>

      {/* Main Layout: Active In-Room Patient EHR + Waiting Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Active Patient */}
        {activeToken ? (
          <div style={{
            background: 'var(--surface-01)',
            borderRadius: 'var(--radius-xl)',
            border: activeToken.priority === 'EMERGENCY' ? '2px solid var(--triage-emergency)' : '1px solid var(--border-subtle)',
            padding: '1.75rem',
            boxShadow: activeToken.priority === 'EMERGENCY' ? 'var(--shadow-emergency)' : 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {/* Header + Dynamic Pressure Timer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-data)', color: 'var(--brand-primary)' }}>
                    {activeToken.tokenNumber}
                  </span>
                  {activeToken.priority === 'EMERGENCY' && (
                    <span style={{ background: 'var(--triage-emergency-bg)', color: 'var(--triage-emergency)', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Flame size={14} />
                      EMERGENCY
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeToken.patientName}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {activeToken.age} Yrs • {activeToken.gender} • Mobile: {activeToken.phone}
                </div>
              </div>

              {/* Consultation Pressure Timer */}
              <div style={{
                background: 'var(--surface-02)',
                border: `1.5px solid ${timerColor}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 1.25rem',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Consultation Time
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-data)', color: timerColor }}>
                  {formatTimer(elapsedSeconds)}
                </div>
                {elapsedMinutes >= 10 && (
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: timerColor }}>
                    {elapsedMinutes >= 15 ? 'Exceeding Turnaround SLA' : 'Target Window (10-15m)'}
                  </div>
                )}
              </div>
            </div>

            {/* Vitals with Sparkline / Range Indicators */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Triaged Clinical Vitals
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {[
                  { label: 'Blood Pressure', val: activeToken.vitals?.bp || '120/80', stat: getBpStatus(activeToken.vitals?.bp || '120/80') },
                  { label: 'Pulse Rate', val: `${activeToken.vitals?.pulse || 76} bpm`, stat: { label: 'Stable', color: 'var(--triage-routine)' } },
                  { label: 'SpO2 Saturation', val: activeToken.vitals?.spo2 || '99%', stat: { label: 'Optimal', color: 'var(--triage-routine)' } },
                  { label: 'Body Temp', val: activeToken.vitals?.temp || '98.4 F', stat: { label: 'Normal', color: 'var(--triage-routine)' } }
                ].map((v, i) => (
                  <div key={i} style={{ background: 'var(--surface-02)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{v.label}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{v.val}</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: v.stat.color, marginTop: '0.1rem' }}>{v.stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div style={{
              background: 'var(--brand-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--brand-dark)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Chief Complaints & Symptoms:
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                "{activeToken.symptoms || 'Patient presenting for routine OPD checkup and evaluation.'}"
              </p>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => recallPatient(activeToken)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'var(--surface-02)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.6rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Volume2 size={15} />
                  <span>Re-announce</span>
                </button>

                <button
                  onClick={() => markNoShow(activeToken.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'var(--triage-emergency-bg)',
                    border: '1px solid var(--triage-emergency-border)',
                    color: 'var(--triage-emergency)',
                    padding: '0.6rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <SkipForward size={15} />
                  <span>Mark No-Show</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => navigate(`/doctor/prescription?token=${activeToken.tokenNumber}&patient=${encodeURIComponent(activeToken.patientName)}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--brand-light)',
                    border: '1px solid var(--border-active)',
                    color: 'var(--brand-primary)',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <FilePlus size={16} />
                  <span>Prescription (Rx)</span>
                </button>

                <button
                  onClick={() => completePatient(activeToken.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--brand-primary)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.65rem 1.4rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Complete & Next (F2)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--surface-01)',
            borderRadius: 'var(--radius-xl)',
            border: '2px dashed var(--border-strong)',
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Stethoscope size={44} color="var(--brand-primary)" style={{ opacity: 0.8, marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Consultation Room Idle
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '380px', marginBottom: '1.5rem' }}>
              {waitingList.length > 0 ? `There are ${waitingList.length} patients waiting in your queue.` : 'No patients currently in waiting line.'}
            </p>
            {waitingList.length > 0 && (
              <button
                onClick={() => callNextPatient(doctorId)}
                style={{
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.8rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Call Next Patient ({waitingList[0]?.tokenNumber} - {waitingList[0]?.patientName})
              </button>
            )}
          </div>
        )}

        {/* Right Column: Waiting List */}
        <div style={{
          background: 'var(--surface-01)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Standby Patient Queue ({waitingList.length})
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Triage Priority Order
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto', maxHeight: '550px' }}>
            {waitingList.map((tok, idx) => (
              <div
                key={tok.id}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: tok.priority === 'EMERGENCY' ? '1.5px solid var(--triage-emergency-border)' : '1px solid var(--border-subtle)',
                  background: tok.priority === 'EMERGENCY' ? 'var(--triage-emergency-bg)' : 'var(--surface-02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-data)', fontWeight: 800, fontSize: '0.92rem', color: 'var(--brand-primary)' }}>
                      {tok.tokenNumber}
                    </span>
                    {tok.priority === 'EMERGENCY' && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--triage-emergency)' }}>
                        ★ EMERGENCY
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {tok.patientName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {tok.age}y / {tok.gender} • {tok.symptoms?.slice(0, 24)}...
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  #{idx + 1}
                </span>
              </div>
            ))}

            {waitingList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                All waiting patients cleared.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
