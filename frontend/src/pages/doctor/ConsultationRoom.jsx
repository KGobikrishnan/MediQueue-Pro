import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { TOKEN_STATUS } from '../../utils/constants';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  FilePlus,
  Heart,
  Maximize2,
  Phone,
  SkipForward,
  Stethoscope,
  User,
  Volume2,
  AlertTriangle
} from 'lucide-react';

export const ConsultationRoom = () => {
  const { user } = useAuth();
  const { queues, callNextPatient, recallPatient, completePatient, markNoShow } = useQueue();
  const navigate = useNavigate();

  const doctorId = user?.id || 'doc-1';
  const doctorName = user?.name || 'Dr. Sarah Jenkins';

  // Active consultation for this doctor
  const activeToken = queues.find(
    (q) => (q.doctorId === doctorId || q.doctorName === doctorName) && q.status === TOKEN_STATUS.IN_CONSULTATION
  );

  // Waiting list for this doctor
  const waitingList = queues
    .filter((q) => (q.doctorId === doctorId || q.doctorName === doctorName) && q.status === TOKEN_STATUS.WAITING)
    .sort((a, b) => {
      const pMap = { EMERGENCY: 3, SENIOR: 2, NORMAL: 1 };
      const pDiff = (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
      if (pDiff !== 0) return pDiff;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  // Completed today by this doctor
  const completedToday = queues.filter(
    (q) => (q.doctorId === doctorId || q.doctorName === doctorName) && q.status === TOKEN_STATUS.COMPLETED
  );

  // Live Consultation Stopwatch Timer
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

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCallNext = () => {
    callNextPatient(doctorId);
  };

  const handleFinishConsultation = () => {
    if (!activeToken) return;
    completePatient(activeToken.id);
  };

  const handleOpenRxBuilder = () => {
    if (activeToken) {
      navigate(`/doctor/prescription?token=${activeToken.tokenNumber}&patient=${encodeURIComponent(activeToken.patientName)}`);
    } else {
      navigate('/doctor/prescription');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner: Doctor Info & Quick Consultation Actions */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem 2rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex'
          }}>
            <Stethoscope size={36} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                {doctorName}
              </h1>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {user?.roomNo || 'Room 204'}
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#e0f2fe' }}>
              Department of {user?.deptName || 'Cardiology'} • OPD Morning Shift
            </p>
          </div>
        </div>

        {/* Global Action: Call Next Patient */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleCallNext}
            disabled={waitingList.length === 0}
            style={{
              background: waitingList.length > 0 ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1.6rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: 'var(--shadow-md)',
              cursor: waitingList.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            <Bell size={20} />
            <span>Call Next Token ({waitingList.length})</span>
          </button>
        </div>
      </div>

      {/* Main Screen Layout: Active Patient Card + Waiting List Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        {/* Left Side: Current In-Room Patient EHR Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activeToken ? (
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: activeToken.priority === 'EMERGENCY' ? '2px solid #ef4444' : '1px solid var(--border-subtle)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              {/* Header with Live Consultation Timer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    fontFamily: 'JetBrains Mono',
                    color: 'var(--primary-600)'
                  }}>
                    {activeToken.tokenNumber}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {activeToken.patientName}
                      </span>
                      {activeToken.priority === 'EMERGENCY' && (
                        <span style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          EMERGENCY TRIAGE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {activeToken.age} Yrs • {activeToken.gender} • Phone: {activeToken.phone}
                    </div>
                  </div>
                </div>

                {/* Live Consultation Timer */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}>
                  <Clock size={20} color="var(--primary-600)" />
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Consultation Timer
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>
                      {formatTimer(elapsedSeconds)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Vitals Grid */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Patient Triage Vitals (Recorded at Reception)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                  {[
                    { label: 'Blood Pressure', val: activeToken.vitals?.bp || '120/80', unit: 'mmHg' },
                    { label: 'Pulse Rate', val: activeToken.vitals?.pulse || '76', unit: 'bpm' },
                    { label: 'SpO2', val: activeToken.vitals?.spo2 || '98%', unit: 'Sat' },
                    { label: 'Body Temp', val: activeToken.vitals?.temp || '98.4 F', unit: 'Temp' },
                    { label: 'Weight', val: activeToken.vitals?.weight || '70 kg', unit: 'Weight' }
                  ].map((vit, idx) => (
                    <div key={idx} style={{
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{vit.label}</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {vit.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chief Complaints / Symptoms */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Chief Symptoms & Complaints:
                </div>
                <p style={{ fontSize: '0.92rem', color: '#0f172a', margin: 0, fontWeight: 500 }}>
                  "{activeToken.symptoms || 'Patient presenting for general OPD consultation review.'}"
                </p>
              </div>

              {/* Action Buttons for Active Patient */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => recallPatient(activeToken)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#f1f5f9',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Volume2 size={16} />
                    <span>Re-announce Token</span>
                  </button>

                  <button
                    onClick={() => markNoShow(activeToken.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#e11d48'
                    }}
                  >
                    <SkipForward size={16} />
                    <span>Mark No-Show</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleOpenRxBuilder}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--primary-50)',
                      border: '1px solid var(--primary-300)',
                      color: 'var(--primary-700)',
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      fontWeight: 700
                    }}
                  >
                    <FilePlus size={18} />
                    <span>Write Rx & Prescription</span>
                  </button>

                  <button
                    onClick={handleFinishConsultation}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--primary-600)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.65rem 1.4rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Complete & Next</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '2px dashed var(--border-strong)',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: 'var(--primary-50)',
                padding: '1.25rem',
                borderRadius: '50%',
                marginBottom: '1rem'
              }}>
                <Stethoscope size={44} color="var(--primary-600)" />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Consultation Room is Currently Empty
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.5rem' }}>
                {waitingList.length > 0
                  ? `There are ${waitingList.length} patients waiting in your OPD queue. Click below to call the next patient.`
                  : 'No patients waiting in queue at this moment.'}
              </p>
              {waitingList.length > 0 && (
                <button
                  onClick={handleCallNext}
                  style={{
                    background: 'var(--primary-600)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.85rem 1.8rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  Call Next Patient ({waitingList[0]?.tokenNumber} - {waitingList[0]?.patientName})
                </button>
              )}
            </div>
          )}

          {/* Quick Doctor Daily Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Patients Consulted Today
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {completedToday.length + 14}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Avg Consultation Time
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-600)', marginTop: '0.25rem' }}>
                11.4 min
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Waiting in Queue
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
                {waitingList.length} Patients
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Waiting Patients Queue List */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Patients in Waiting
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Sorted by Triage Priority & Arrival Time
              </span>
            </div>
            <span style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {waitingList.length} Pending
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '600px' }}>
            {waitingList.map((token, idx) => (
              <div
                key={token.id}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: token.priority === 'EMERGENCY' ? '1px solid #fca5a5' : '1px solid var(--border-subtle)',
                  background: token.priority === 'EMERGENCY' ? '#fef2f2' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-700)' }}>
                      {token.tokenNumber}
                    </span>
                    {token.priority === 'EMERGENCY' && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        EMERGENCY
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {token.patientName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {token.age}y / {token.gender} • {token.symptoms?.slice(0, 30)}...
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Position #{idx + 1}
                  </div>
                </div>
              </div>
            ))}

            {waitingList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                No more waiting patients for your room.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
