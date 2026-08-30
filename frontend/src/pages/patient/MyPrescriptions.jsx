import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import { FileText, Download, Calendar, Stethoscope, Clock } from 'lucide-react';

export const MyPrescriptions = () => {
  const { prescriptions } = useQueue();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          My Digital Prescriptions & Medical Summaries
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          NABH Verified Electronic Health Records (EHR) • Instant PDF Download
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                background: 'var(--primary-50)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--primary-600)',
                display: 'flex'
              }}>
                <FileText size={32} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {rx.diagnosis}
                  </h2>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono', background: 'var(--primary-100)', color: 'var(--primary-800)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    {rx.tokenNumber || 'OPD-RX'}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  Prescribed by <strong>{rx.doctorName}</strong> ({rx.deptName || 'Cardiology'}) on {rx.date}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Medicines: {rx.medicines?.map((m) => m.name).join(', ') || '3 medications prescribed'}
                </div>
              </div>
            </div>

            <button
              onClick={() => generatePrescriptionPDF(rx)}
              style={{
                background: 'var(--primary-600)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1.25rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Download size={17} />
              <span>Download PDF</span>
            </button>
          </div>
        ))}

        {prescriptions.length === 0 && (
          <div style={{ background: '#ffffff', padding: '3rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No prescriptions on file yet.
          </div>
        )}
      </div>
    </div>
  );
};
