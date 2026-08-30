import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { Calendar, Clock, Check, Plus, AlertCircle, Save } from 'lucide-react';

export const DoctorSchedule = () => {
  const { user } = useAuth();
  const [slotDuration, setSlotDuration] = useState(15);
  const [maxPatients, setMaxPatients] = useState(30);
  const [isSaved, setIsSaved] = useState(false);

  const [daysSchedule, setDaysSchedule] = useState([
    { day: 'Monday', active: true, morningShift: '09:00 AM - 01:00 PM', eveningShift: '04:30 PM - 07:30 PM', room: 'Room 204' },
    { day: 'Tuesday', active: true, morningShift: '09:00 AM - 01:00 PM', eveningShift: '04:30 PM - 07:30 PM', room: 'Room 204' },
    { day: 'Wednesday', active: true, morningShift: '09:00 AM - 01:00 PM', eveningShift: '04:30 PM - 07:30 PM', room: 'Room 204' },
    { day: 'Thursday', active: true, morningShift: '09:00 AM - 01:00 PM', eveningShift: '04:30 PM - 07:30 PM', room: 'Room 204' },
    { day: 'Friday', active: true, morningShift: '09:00 AM - 01:00 PM', eveningShift: '04:30 PM - 07:30 PM', room: 'Room 204' },
    { day: 'Saturday', active: true, morningShift: '09:00 AM - 01:00 PM', eveningShift: 'Off', room: 'Room 204' },
    { day: 'Sunday', active: false, morningShift: 'Off', eveningShift: 'Off', room: 'On Call' }
  ]);

  const toggleDay = (idx) => {
    const updated = [...daysSchedule];
    updated[idx].active = !updated[idx].active;
    setDaysSchedule(updated);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Doctor OPD Availability & Slot Matrix
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Configure weekly consultation shifts, slot durations, and OPD capacity
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            background: 'var(--primary-600)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Save size={18} />
          <span>Save OPD Schedule</span>
        </button>
      </div>

      {isSaved && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          color: '#16a34a',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          OPD schedule & slot configuration updated successfully!
        </div>
      )}

      {/* Capacity & Slot Timing Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '1.25rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.25rem'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            ESTIMATED CONSULTATION TIME / PATIENT
          </label>
          <select
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              fontWeight: 600
            }}
          >
            <option value={10}>10 Minutes / Slot (Fast OPD)</option>
            <option value={15}>15 Minutes / Slot (Standard)</option>
            <option value={20}>20 Minutes / Slot (Detailed / Speciality)</option>
            <option value={30}>30 Minutes / Slot (Super Speciality / New)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            MAX OPD DAILY TOKEN CAP
          </label>
          <input
            type="number"
            value={maxPatients}
            onChange={(e) => setMaxPatients(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              fontWeight: 600
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            AUTO-EXPIRATION BUFFER FOR UNARRIVED SLOTS
          </label>
          <div style={{ padding: '0.6rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            15 Minutes (Spring Scheduler Auto-clears)
          </div>
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>DAY</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>OPD STATUS</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>MORNING SHIFT</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>EVENING SHIFT</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>ALLOCATED ROOM</th>
            </tr>
          </thead>
          <tbody>
            {daysSchedule.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.day}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    onClick={() => toggleDay(idx)}
                    style={{
                      background: item.active ? '#dcfce7' : '#f1f5f9',
                      color: item.active ? '#15803d' : '#64748b',
                      border: 'none',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  >
                    {item.active ? 'Available' : 'On Leave / Off'}
                  </button>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.9rem', color: item.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {item.morningShift}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.9rem', color: item.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {item.eveningShift}
                </td>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary-700)' }}>
                  {item.room}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
