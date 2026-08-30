import React from 'react';
import { DEPARTMENTS } from '../../utils/constants';
import { Building2, Plus, Clock, Users, MapPin } from 'lucide-react';

export const DeptManagement = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1050px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          OPD Department & Clinic Configurations
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Floor plans, OPD token prefixes, operating shifts, and capacity thresholds
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {dept.name}
                </h3>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '0.8rem', background: 'var(--primary-100)', color: 'var(--primary-800)', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                  Code: {dept.code}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="var(--primary-600)" />
                <span>{dept.floor} (Rooms {dept.roomStart} - {dept.roomStart + 6})</span>
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              fontSize: '0.8rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem' }}>CLINICAL HEAD</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{dept.head || 'Dr. Sarah Jenkins'}</div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem' }}>DAILY TOKEN LIMIT</div>
                <div style={{ fontWeight: 700, color: 'var(--primary-700)', marginTop: '0.1rem' }}>60 Tokens / Day</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
