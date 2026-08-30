import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DEPARTMENTS, TRIAGE_PRIORITIES } from '../../utils/constants';
import { generateTokenSlipPDF } from '../../utils/pdfGenerator';
import {
  UserPlus,
  Search,
  Printer,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  User,
  Phone,
  Clock,
  Sparkles
} from 'lucide-react';

const RECURRING_PATIENT_DIRECTORY = [
  { name: 'Karthik Ramanathan', phone: '9840112345', age: 54, gender: 'Male', vitals: { bp: '140/90', pulse: '78', spo2: '98%', temp: '98.4 F', weight: '76 kg' } },
  { name: 'Meenakshi Sundaram', phone: '9840198765', age: 68, gender: 'Female', vitals: { bp: '135/85', pulse: '72', spo2: '99%', temp: '98.2 F', weight: '62 kg' } },
  { name: 'Ananya Deshmukh', phone: '9884123456', age: 29, gender: 'Female', vitals: { bp: '115/75', pulse: '80', spo2: '99%', temp: '98.6 F', weight: '58 kg' } }
];

export const WalkInRegistration = () => {
  const { doctors, addWalkInPatient } = useQueue();

  const [phoneSearch, setPhoneSearch] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('cardiology');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [priority, setPriority] = useState('NORMAL');
  const [symptoms, setSymptoms] = useState('');

  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('76');
  const [spo2, setSpo2] = useState('99%');
  const [temp, setTemp] = useState('98.4 F');
  const [weight, setWeight] = useState('70 kg');

  const [generatedToken, setGeneratedToken] = useState(null);

  // Phone fast search
  const handlePhoneSearch = (searchVal) => {
    setPhoneSearch(searchVal);
    const found = RECURRING_PATIENT_DIRECTORY.find((p) => p.phone.includes(searchVal));
    if (found && searchVal.length >= 5) {
      setPatientName(found.name);
      setAge(found.age);
      setGender(found.gender);
      setPhone(found.phone);
      if (found.vitals) {
        setBp(found.vitals.bp);
        setPulse(found.vitals.pulse);
        setSpo2(found.vitals.spo2);
        setTemp(found.vitals.temp);
        setWeight(found.vitals.weight);
      }
    }
  };

  const handleDeptChange = (deptId) => {
    setDepartment(deptId);
    const deptDoc = doctors.find((d) => d.department === deptId);
    if (deptDoc) {
      setDoctorId(deptDoc.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    const deptObj = DEPARTMENTS.find((d) => d.id === department);

    const token = addWalkInPatient({
      patientName,
      phone,
      age,
      gender,
      department,
      deptCode: deptObj?.code || 'OPD',
      doctorId,
      priority,
      symptoms: symptoms || 'Walk-in consultation request',
      vitals: { bp, pulse, spo2, temp, weight }
    });

    setGeneratedToken(token);
    generateTokenSlipPDF(token); // Auto generate & print slip
  };

  const handleNewRegistration = () => {
    setGeneratedToken(null);
    setPatientName('');
    setAge('');
    setPhone('');
    setPhoneSearch('');
    setSymptoms('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1050px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Rapid Walk-In Patient Registration & Triage
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          OPD Front Desk • Phone Fast Search • Priority Token Generator
        </p>
      </div>

      {/* Generated Token Modal / Banner */}
      {generatedToken && (
        <div style={{
          background: 'linear-gradient(135deg, #0284c7, #0369a1)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={24} color="#4ade80" />
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>OPD Token Generated Successfully!</span>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'JetBrains Mono' }}>
              {generatedToken.tokenNumber}
            </div>
            <div style={{ fontSize: '1rem', color: '#e0f2fe' }}>
              Patient: <strong>{generatedToken.patientName}</strong> • Room: <strong>{generatedToken.roomNo}</strong> ({generatedToken.doctorName})
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => generateTokenSlipPDF(generatedToken)}
              style={{
                background: '#ffffff',
                color: '#0284c7',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.4rem',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <Printer size={18} />
              <span>Print Token Slip PDF</span>
            </button>

            <button
              onClick={handleNewRegistration}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 1.2rem',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              + Register Next Patient
            </button>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Fast Phone Search Bar */}
        <div style={{
          background: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Search size={22} color="var(--primary-700)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase' }}>
              Returning Patient Fast Phone Lookup (Auto-fills Demographics & Vitals)
            </div>
            <input
              type="text"
              placeholder="Enter phone number (e.g. 9840112345)..."
              value={phoneSearch}
              onChange={(e) => handlePhoneSearch(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.75rem',
                marginTop: '0.3rem',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Section 1: Demographics */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
            1. Patient Demographics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Subramanian"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Age *
              </label>
              <input
                type="number"
                required
                placeholder="45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: '#fff' }}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="9840112345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Department, Doctor & Triage Priority */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
            2. Department, Doctor & Triage Priority
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                OPD Speciality Department
              </label>
              <select
                value={department}
                onChange={(e) => handleDeptChange(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: '#fff', fontWeight: 600 }}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.floor})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Assigned Doctor
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: '#fff', fontWeight: 600 }}
              >
                {doctors
                  .filter((d) => d.department === department)
                  .map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.roomNo}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Triage Priority Flag
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: priority === 'EMERGENCY' ? '2px solid #ef4444' : '1px solid var(--border-strong)',
                  background: priority === 'EMERGENCY' ? '#fef2f2' : '#fff',
                  color: priority === 'EMERGENCY' ? '#dc2626' : 'var(--text-primary)',
                  fontWeight: 700
                }}
              >
                <option value="NORMAL">Regular OPD (Standard)</option>
                <option value="SENIOR">Senior Citizen / Pediatric Priority</option>
                <option value="EMERGENCY">🚨 Emergency Red Flag (Top of Queue)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Vitals Recorded at Triage */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
            3. Initial Triage Vitals & Symptoms
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>BP (mmHg)</label>
              <input type="text" value={bp} onChange={(e) => setBp(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Pulse (bpm)</label>
              <input type="text" value={pulse} onChange={(e) => setPulse(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>SpO2 (%)</label>
              <input type="text" value={spo2} onChange={(e) => setSpo2(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Temp (°F)</label>
              <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Weight (kg)</label>
              <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Presenting Symptoms / Chief Complaints
            </label>
            <input
              type="text"
              placeholder="e.g. Chest heaviness, persistent fever for 2 days, back pain"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
            />
          </div>
        </div>

        {/* Submit */}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <UserPlus size={20} />
          <span>Generate OPD Token Slip & Push to Queue</span>
        </button>
      </form>
    </div>
  );
};
