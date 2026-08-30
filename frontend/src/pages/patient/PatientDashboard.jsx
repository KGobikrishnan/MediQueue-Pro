import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import { generateTokenSlipPDF } from '../../utils/pdfGenerator';
import {
  HeartPulse,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  Calendar,
  Sparkles,
  PhoneCall,
  ExternalLink
} from 'lucide-react';

export const PatientDashboard = () => {
  const { queues, prescriptions, lastCalledToken } = useQueue();
  const [copiedShare, setCopiedShare] = useState(false);

  // Fallback demo patient Karthik Ramanathan
  const myToken = queues.find((q) => q.patientName === 'Karthik Ramanathan') || queues[0];

  const waitingAhead = myToken
    ? queues.filter(
        (q) =>
          q.doctorId === myToken.doctorId &&
          q.status === 'WAITING' &&
          new Date(q.createdAt) < new Date(myToken.createdAt)
      ).length
    : 0;

  const isMyTokenActive = myToken?.status === 'IN_CONSULTATION';
  const totalInQueue = waitingAhead + (isMyTokenActive ? 0 : 1);
  const currentStep = isMyTokenActive ? totalInQueue : totalInQueue - waitingAhead;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hospital OPD Live Tracker: My Token ${myToken.tokenNumber} is currently at position #${waitingAhead + 1} with ${myToken.doctorName} (${myToken.roomNo}). Track live: https://mediqueuepro.org/track`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Turn Notification Hero Banner (Takes over if active) */}
      {isMyTokenActive && (
        <div className="emergency-pulse" style={{
          background: 'linear-gradient(135deg, #15803d, #166534)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-raised)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Radio size={20} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DOCTOR IS CALLING YOU NOW
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>
              Please Proceed To {myToken.roomNo}
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#bbf7d0' }}>
              {myToken.doctorName} • {myToken.department?.toUpperCase()}
            </p>
          </div>

          <button
            onClick={() => window.open('/live-queue', '_blank')}
            style={{
              background: '#ffffff',
              color: '#15803d',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            View Live TV Screen
          </button>
        </div>
      )}

      {/* Main Token Tracker Card */}
      {myToken ? (
        <div style={{
          background: 'var(--surface-01)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '2rem',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Patient Appointment Session
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                {myToken.patientName} ({myToken.phone})
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleShareWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Share2 size={14} />
                <span>{copiedShare ? 'Opening WhatsApp...' : 'Share Status with Family'}</span>
              </button>

              <button
                onClick={() => generateTokenSlipPDF(myToken)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'var(--surface-02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Printer size={14} />
                <span>Download Slip</span>
              </button>
            </div>
          </div>

          {/* Big Token Number */}
          <div style={{
            background: 'linear-gradient(135deg, var(--brand-light), #e0f2fe)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              YOUR ASSIGNED OPD TOKEN
            </div>
            <div style={{ fontSize: '4.5rem', fontWeight: 900, fontFamily: 'var(--font-data)', color: 'var(--brand-primary)', letterSpacing: '0.05em', margin: '0.3rem 0' }}>
              {myToken.tokenNumber}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {myToken.doctorName} • {myToken.roomNo}
            </div>
          </div>

          {/* Animated Queue Progress Bar (●●●○○) */}
          <div style={{
            background: 'var(--surface-02)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Live Queue Progress Index
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)', fontFamily: 'var(--font-data)' }}>
                {isMyTokenActive ? 'In Consultation (0 ahead)' : `${waitingAhead} Patients Ahead of You`}
              </span>
            </div>

            {/* Visual Dot / Progress Bar */}
            <div style={{
              width: '100%',
              height: '10px',
              background: '#e2e8f0',
              borderRadius: '999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: isMyTokenActive ? '100%' : `${Math.max(25, 100 - (waitingAhead * 20))}%`,
                height: '100%',
                background: isMyTokenActive ? '#22c55e' : 'var(--brand-primary)',
                transition: 'width 300ms ease'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <span>Registered at Triage</span>
              <span>Waiting Room Standby</span>
              <span>Consultation Room</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Prescriptions History Grid */}
      <div style={{
        background: 'var(--surface-01)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            My Verified Electronic Prescriptions
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              style={{
                background: 'var(--surface-02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {rx.diagnosis}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {rx.doctorName} ({rx.deptName || 'Cardiology'}) • Date: {rx.date}
                </div>
              </div>

              <button
                onClick={() => generatePrescriptionPDF(rx)}
                style={{
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
