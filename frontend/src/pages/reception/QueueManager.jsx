import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { TOKEN_STATUS, DEPARTMENTS } from '../../utils/constants';
import { generateTokenSlipPDF } from '../../utils/pdfGenerator';
import {
  Search,
  Volume2,
  Printer,
  XCircle,
  ArrowUp,
  Flame,
  CheckCircle2,
  Clock,
  ArrowUpDown
} from 'lucide-react';

export const QueueManager = () => {
  const { queues, bumpToTop, recallPatient, markNoShow } = useQueue();
  const [filterDept, setFilterDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQueues = queues.filter((item) => {
    if (filterDept !== 'ALL' && item.department !== filterDept) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.tokenNumber.toLowerCase().includes(q) ||
        item.patientName.toLowerCase().includes(q) ||
        (item.phone && item.phone.includes(q))
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Live Queue Manager & Priority Orchestrator
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Real-time triage overrides • Emergency bumping to top • Instant slip re-printing
        </p>
      </div>

      {/* Control Bar */}
      <div style={{
        background: 'var(--surface-01)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
          <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Token, Patient, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.3rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              fontSize: '0.88rem'
            }}
          />
        </div>

        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          style={{ padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: '#fff', fontSize: '0.85rem' }}
        >
          <option value="ALL">All Specialities</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface-01)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface-02)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TOKEN #</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PATIENT DEMOGRAPHICS</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>CLINIC / DOCTOR</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TRIAGE PRIORITY</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>STATUS</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueues.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-data)', fontWeight: 800, fontSize: '1rem', color: 'var(--brand-primary)' }}>
                  {item.tokenNumber}
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.patientName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.age}y / {item.gender} • {item.phone}
                  </div>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.doctorName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.roomNo}</div>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  {item.priority === 'EMERGENCY' ? (
                    <span style={{ background: 'var(--triage-emergency-bg)', color: 'var(--triage-emergency)', border: '1px solid var(--triage-emergency-border)', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Flame size={12} />
                      EMERGENCY
                    </span>
                  ) : item.priority === 'SENIOR' ? (
                    <span style={{ background: 'var(--triage-urgent-bg)', color: 'var(--triage-urgent)', border: '1px solid var(--triage-urgent-border)', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                      SENIOR / CHILD
                    </span>
                  ) : (
                    <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                      REGULAR
                    </span>
                  )}
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  {item.status === TOKEN_STATUS.IN_CONSULTATION ? (
                    <span style={{ background: '#e0f2fe', color: '#0284c7', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      IN ROOM
                    </span>
                  ) : item.status === TOKEN_STATUS.WAITING ? (
                    <span style={{ background: '#fef9c3', color: '#a16207', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      WAITING
                    </span>
                  ) : (
                    <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      {item.status}
                    </span>
                  )}
                </td>

                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                    {/* Bump To Top Action */}
                    {item.status === TOKEN_STATUS.WAITING && (
                      <button
                        onClick={() => bumpToTop(item.id)}
                        title="Bump to Emergency Top of Queue"
                        style={{
                          background: 'var(--triage-emergency-bg)',
                          border: '1px solid var(--triage-emergency-border)',
                          borderRadius: '6px',
                          padding: '0.35rem 0.55rem',
                          color: 'var(--triage-emergency)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <ArrowUp size={14} />
                        <span>Bump Top</span>
                      </button>
                    )}

                    <button
                      onClick={() => recallPatient(item)}
                      title="Announce on TV"
                      style={{ background: '#f1f5f9', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.35rem', color: 'var(--brand-primary)', cursor: 'pointer' }}
                    >
                      <Volume2 size={15} />
                    </button>

                    <button
                      onClick={() => generateTokenSlipPDF(item)}
                      title="Print 80mm Receipt"
                      style={{ background: '#f1f5f9', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.35rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      <Printer size={15} />
                    </button>

                    {item.status === TOKEN_STATUS.WAITING && (
                      <button
                        onClick={() => markNoShow(item.id)}
                        title="Mark No Show"
                        style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', padding: '0.35rem', color: '#e11d48', cursor: 'pointer' }}
                      >
                        <XCircle size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
