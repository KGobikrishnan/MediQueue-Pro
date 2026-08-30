import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DEPARTMENTS, TOKEN_STATUS } from '../../utils/constants';
import { generateTokenSlipPDF } from '../../utils/pdfGenerator';
import {
  ClipboardList,
  Search,
  Filter,
  Volume2,
  Printer,
  XCircle,
  CheckCircle,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export const QueueManager = () => {
  const { queues, doctors, recallPatient, completePatient, markNoShow } = useQueue();
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQueues = queues.filter((item) => {
    if (filterDept !== 'ALL' && item.department !== filterDept) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
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
          Central OPD Queue Orchestrator
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Real-time patient flow controller • Token re-announcement • Status overrides
        </p>
      </div>

      {/* Control Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Token, Patient Name, or Mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem 0.6rem 2.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: '#fff', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: '#fff', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value={TOKEN_STATUS.WAITING}>Waiting</option>
            <option value={TOKEN_STATUS.IN_CONSULTATION}>In Consultation</option>
            <option value={TOKEN_STATUS.COMPLETED}>Completed</option>
            <option value={TOKEN_STATUS.NO_SHOW}>No Show</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TOKEN REF</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PATIENT DETAILS</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>DEPT / DOCTOR</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TRIAGE PRIORITY</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>LIVE STATUS</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>ISSUED TIME</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueues.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem', fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1rem', color: 'var(--primary-700)' }}>
                  {item.tokenNumber}
                </td>

                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.patientName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {item.age}y / {item.gender} • {item.phone}
                  </div>
                </td>

                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {item.department}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.doctorName} ({item.roomNo})
                  </div>
                </td>

                <td style={{ padding: '1rem' }}>
                  {item.priority === 'EMERGENCY' ? (
                    <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                      EMERGENCY
                    </span>
                  ) : item.priority === 'SENIOR' ? (
                    <span style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                      SENIOR / CHILD
                    </span>
                  ) : (
                    <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                      REGULAR
                    </span>
                  )}
                </td>

                <td style={{ padding: '1rem' }}>
                  {item.status === TOKEN_STATUS.IN_CONSULTATION ? (
                    <span style={{ background: '#e0f2fe', color: '#0284c7', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }}></span>
                      IN ROOM
                    </span>
                  ) : item.status === TOKEN_STATUS.WAITING ? (
                    <span style={{ background: '#fef9c3', color: '#a16207', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      WAITING
                    </span>
                  ) : item.status === TOKEN_STATUS.COMPLETED ? (
                    <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      COMPLETED
                    </span>
                  ) : (
                    <span style={{ background: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      NO SHOW
                    </span>
                  )}
                </td>

                <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>

                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => recallPatient(item)}
                      title="Announce on TV Screen"
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '0.4rem',
                        color: 'var(--primary-700)'
                      }}
                    >
                      <Volume2 size={16} />
                    </button>

                    <button
                      onClick={() => generateTokenSlipPDF(item)}
                      title="Print Token Slip"
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '0.4rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Printer size={16} />
                    </button>

                    {item.status === TOKEN_STATUS.WAITING && (
                      <button
                        onClick={() => markNoShow(item.id)}
                        title="Mark No Show"
                        style={{
                          background: '#fff1f2',
                          border: '1px solid #fecdd3',
                          borderRadius: '6px',
                          padding: '0.4rem',
                          color: '#e11d48'
                        }}
                      >
                        <XCircle size={16} />
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
