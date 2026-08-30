import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { DEPARTMENTS } from '../../utils/constants';
import { generateTokenSlipPDF } from '../../utils/pdfGenerator';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM', '09:20 AM', '09:40 AM',
  '10:00 AM', '10:20 AM', '10:40 AM',
  '11:00 AM', '11:20 AM', '11:40 AM',
  '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM'
];

export const BookAppointment = () => {
  const { user } = useAuth();
  const { doctors, addWalkInPatient } = useQueue();
  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState('cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdToken, setCreatedToken] = useState(null);

  const availableDoctors = doctors.filter((d) => d.department === selectedDept);
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || availableDoctors[0];

  const handleDeptSelect = (deptId) => {
    setSelectedDept(deptId);
    const doc = doctors.find((d) => d.department === deptId);
    if (doc) setSelectedDoctorId(doc.id);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const deptObj = DEPARTMENTS.find((d) => d.id === selectedDept);

    const token = addWalkInPatient({
      patientName: user?.name || 'Karthik Ramanathan',
      phone: user?.phone || '9840112345',
      age: user?.age || 54,
      gender: user?.gender || 'Male',
      department: selectedDept,
      deptCode: deptObj?.code || 'OPD',
      doctorId: selectedDoctorId,
      priority: 'NORMAL',
      symptoms: symptoms || `Pre-booked online appointment for ${selectedSlot} on ${selectedDate}`
    });

    setCreatedToken(token);
    setIsSuccess(true);
    generateTokenSlipPDF(token);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Book OPD Appointment & Slot
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Select speciality department, consultant doctor, date, and preferred consultation time slot
        </p>
      </div>

      {isSuccess && createdToken ? (
        <div style={{
          background: 'linear-gradient(135deg, #0284c7, #0369a1)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '50%', marginBottom: '1rem', color: '#0284c7' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            Appointment & Token Confirmed!
          </h2>
          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'JetBrains Mono', color: '#ffffff', margin: '0.5rem 0' }}>
            {createdToken.tokenNumber}
          </div>
          <p style={{ fontSize: '1rem', color: '#e0f2fe', maxWidth: '500px', marginBottom: '1.5rem' }}>
            Your consultation with <strong>{createdToken.doctorName}</strong> ({createdToken.department?.toUpperCase()}) is confirmed for <strong>{selectedDate} at {selectedSlot}</strong> in <strong>{createdToken.roomNo}</strong>.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => generateTokenSlipPDF(createdToken)}
              style={{
                background: '#ffffff',
                color: '#0284c7',
                border: 'none',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.95rem'
              }}
            >
              Download PDF Slip
            </button>

            <button
              onClick={() => navigate('/patient/dashboard')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              View Active Queue Status →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Step 1: Speciality Department Grid */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              1. Choose Clinical Speciality
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedDept === dept.id;
                return (
                  <div
                    key={dept.id}
                    onClick={() => handleDeptSelect(dept.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--primary-50)' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? 'var(--primary-800)' : 'var(--text-primary)' }}>
                      {dept.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {dept.floor} • OPD Code: {dept.code}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Doctor Selection & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                2. Select Consultant Doctor
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {availableDoctors.map((doc) => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--primary-50)' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? 'var(--primary-800)' : 'var(--text-primary)' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {doc.qualification}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)', background: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {doc.roomNo}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                3. Choose Appointment Date
              </h2>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              />
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                OPD slots open for booking up to 14 days in advance.
              </div>
            </div>
          </div>

          {/* Step 3: Slot Grid */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              4. Available Time Slots ({selectedDate})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-strong)',
                      background: isSelected ? 'var(--primary-600)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Symptoms */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '1.5rem'
          }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Reason for Consultation / Key Symptoms
            </label>
            <input
              type="text"
              placeholder="e.g. Regular cardiac review, shortness of breath, blood test analysis"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            Confirm Slot & Generate OPD Token
          </button>
        </form>
      )}
    </div>
  );
};
