import React from 'react';
import { useQueue } from '../../context/QueueContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Activity,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Stethoscope,
  Building2,
  Calendar
} from 'lucide-react';

const FOOTFALL_DATA = [
  { time: '08:00 AM', patients: 12, emergency: 2 },
  { time: '09:00 AM', patients: 38, emergency: 5 },
  { time: '10:00 AM', patients: 64, emergency: 8 },
  { time: '11:00 AM', patients: 55, emergency: 4 },
  { time: '12:00 PM', patients: 42, emergency: 3 },
  { time: '01:00 PM', patients: 20, emergency: 1 },
  { time: '04:30 PM', patients: 35, emergency: 3 },
  { time: '05:30 PM', patients: 48, emergency: 4 },
  { time: '06:30 PM', patients: 30, emergency: 2 }
];

const DEPT_LOAD_DATA = [
  { name: 'Cardiology', value: 84, color: '#0284c7' },
  { name: 'General Medicine', value: 142, color: '#0d9488' },
  { name: 'Orthopedics', value: 68, color: '#f59e0b' },
  { name: 'Pediatrics', value: 52, color: '#8b5cf6' },
  { name: 'Dermatology', value: 40, color: '#ec4899' },
  { name: 'Neurology', value: 31, color: '#6366f1' }
];

const DOCTOR_PERFORMANCE = [
  { doctor: 'Dr. Sarah Jenkins', dept: 'Cardiology', consulted: 32, avgTimeMin: 12, rating: '4.9/5' },
  { doctor: 'Dr. Robert Vance', dept: 'General Medicine', consulted: 48, avgTimeMin: 8, rating: '4.8/5' },
  { doctor: 'Dr. Rajesh Nair', dept: 'Orthopedics', consulted: 24, avgTimeMin: 16, rating: '4.9/5' },
  { doctor: 'Dr. Elena Rostova', dept: 'Pediatrics', consulted: 36, avgTimeMin: 10, rating: '5.0/5' }
];

export const AdminDashboard = () => {
  const { queues, doctors } = useQueue();

  const totalPatientsToday = 417;
  const avgWaitTime = '14.2 min';
  const opdEfficiency = '94.8%';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          OPD Executive Analytics & Hospital Intelligence
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Daily footfall metrics, department queue loads, doctor turnaround time, and capacity KPIs
        </p>
      </div>

      {/* Metric Cards Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {[
          { label: 'TOTAL OPD FOOTFALL TODAY', val: totalPatientsToday, delta: '+18% vs yesterday', icon: Users, color: '#0284c7' },
          { label: 'ACTIVE CONSULTATION ROOMS', val: `${doctors.length} Doctors`, delta: '100% capacity', icon: Stethoscope, color: '#0d9488' },
          { label: 'AVERAGE PATIENT WAIT TIME', val: avgWaitTime, delta: '-4.5 min reduction', icon: Clock, color: '#8b5cf6' },
          { label: 'OPD RETENTION & SATISFACTION', val: opdEfficiency, delta: '★ 4.9 Hospital CSAT', icon: TrendingUp, color: '#16a34a' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
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
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {item.val}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color, marginTop: '0.2rem' }}>
                  {item.delta}
                </div>
              </div>

              <div style={{
                background: `${item.color}15`,
                color: item.color,
                padding: '0.75rem',
                borderRadius: 'var(--radius-lg)'
              }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        {/* Footfall Hourly Rush Index (Bar Chart) */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Hourly Patient Influx & Emergency Triage Rush
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Real-time OPD token registration volume by hour
          </p>

          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FOOTFALL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '0.85rem' }}
                />
                <Legend />
                <Bar dataKey="patients" name="Regular OPD Tokens" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="emergency" name="Emergency Priority" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Queue Share (Donut / Pie Chart) */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Department Load Share
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            OPD capacity distribution across specialities
          </p>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEPT_LOAD_DATA}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DEPT_LOAD_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '0.85rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.5rem' }}>
            {DEPT_LOAD_DATA.slice(0, 4).map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Performance & Turnaround Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Consultant Performance & Turnaround Benchmarks
        </h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>DOCTOR NAME</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>DEPARTMENT</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TODAY'S CONSULTATIONS</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>AVG TIME / PATIENT</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PATIENT RATING</th>
            </tr>
          </thead>
          <tbody>
            {DOCTOR_PERFORMANCE.map((doc, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{doc.doctor}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{doc.dept}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'JetBrains Mono' }}>{doc.consulted} Patients</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}>{doc.avgTimeMin} mins</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#16a34a', fontSize: '0.85rem' }}>{doc.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
