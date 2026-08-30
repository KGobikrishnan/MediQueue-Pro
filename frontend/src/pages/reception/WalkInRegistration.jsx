import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DEPARTMENTS, TRIAGE_PRIORITIES } from '../../utils/constants';
import { generateTokenSlipPDF } from '../../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import {
  UserPlus,
  Search,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpCircle,
  GripVertical
} from 'lucide-react';

const RECURRING_PATIENT_DIRECTORY = [
  { name: 'Karthik Ramanathan', phone: '9840112345', age: 54, gender: 'Male', vitals: { bp: '140/90', pulse: '78', spo2: '98%', temp: '98.4 F', weight: '76 kg' } },
  { name: 'Meenakshi Sundaram', phone: '9840198765', age: 68, gender: 'Female', vitals: { bp: '135/85', pulse: '72', spo2: '99%', temp: '98.2 F', weight: '62 kg' } },
  { name: 'Ananya Deshmukh', phone: '9884123456', age: 29, gender: 'Female', vitals: { bp: '115/75', pulse: '80', spo2: '99%', temp: '98.6 F', weight: '58 kg' } },
  { name: 'Vijay Kumar', phone: '9790899887', age: 41, gender: 'Male', vitals: { bp: '128/82', pulse: '74', spo2: '99%', temp: '98.6 F', weight: '80 kg' } }
];

export const WalkInRegistration = () => {
  const { doctors, addWalkInPatient } = useQueue();

  const [phoneSearch, setPhoneSearch] = useState('');
  const [matchingPatients, setMatchingPatients] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('cardiology');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [priority, setPriority] = useState('NORMAL');
  const [symptoms, setSymptoms] = useState('');

  // Vitals
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('76');
  const [spo2, setSpo2] = useState('99%');
  const [temp, setTemp] = useState('98.4 F');
  const [weight, setWeight] = useState('70 kg');

  const [generatedToken, setGeneratedToken] = useState(null);

  // Vitals Clinical Warning Detector
  const isBpCritical = (() => {
    try {
      const sys = parseInt(bp.split('/')[0], 10);
      const dia = parseInt(bp.split('/')[1], 10);
      return sys >= 160 || dia >= 100;
    } catch {
      return false;
    }
  })();

  const isSpo2Critical = (() => {
    try {
      const val = parseInt(spo2.replace('%', ''), 10);
      return val < 94;
    } catch {
      return false;
    }
  })();

  // Phone fast search
  const handlePhoneInputChange = (searchVal) => {
    setPhoneSearch(searchVal);
    setPhone(searchVal);
    if (searchVal.length >= 3) {
      const matches = RECURRING_PATIENT_DIRECTORY.filter((p) => p.phone.includes(searchVal) || p.name.toLowerCase().includes(searchVal.toLowerCase()));
      setMatchingPatients(matches);
    } else {
      setMatchingPatients([]);
    }
  };

  const selectPatientSuggestion = (p) => {
    setPatientName(p.name);
    setAge(p.age);
    setGender(p.gender);
    setPhone(p.phone);
    setPhoneSearch(p.phone);
    if (p.vitals) {
      setBp(p.vitals.bp);
      setPulse(p.vitals.pulse);
      setSpo2(p.vitals.spo2);
      setTemp(p.vitals.temp);
      setWeight(p.vitals.weight);
    }
    setMatchingPatients([]);
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
      symptoms: symptoms || 'Walk-in triage consultation request',
      vitals: { bp, pulse, spo2, temp, weight }
    });

    setGeneratedToken(token);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Rapid Walk-In Registration & Triage Entry
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Smart auto-completion • Clinical out-of-range triage triggers • 80mm slip generation
        </p>
      </div>

      {/* Generated Token Banner with Confetti */}
      {generatedToken && (
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-dark))',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-raised)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <CheckCircle2 size={24} color="#4ade80" />
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Token Issued Successfully</span>
            </div>
            <div style={{ fontSize: '3.4rem', fontWeight: 900, fontFamily: 'var(--font-data)', letterSpacing: '0.1em' }}>
              {generatedToken.tokenNumber}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#e0f2fe' }}>
              Patient: <strong>{generatedToken.patientName}</strong> • {generatedToken.department?.toUpperCase()} ({generatedToken.roomNo})
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => generateTokenSlipPDF(generatedToken)}
              style={{
                background: '#ffffff',
                color: 'var(--brand-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.4rem',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={18} />
              <span>Print 80mm Slip</span>
            </button>

            <button
              onClick={() => {
                setGeneratedToken(null);
                setPatientName('');
                setAge('');
                setPhone('');
                setPhoneSearch('');
                setSymptoms('');
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 1.2rem',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              + Next Patient (F1)
            </button>
          </div>
        </div>
      )}

      {/* Critical Triage Alert Bar if Vitals out of range */}
      {(isBpCritical || isSpo2Critical) && (
        <div className="emergency-pulse" style={{
          background: 'var(--triage-emergency-bg)',
          border: '1.5px solid var(--triage-emergency-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--triage-emergency)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Flame size={24} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                Clinical Out-Of-Range Vitals Detected ({isBpCritical ? `High BP ${bp}` : ''} {isSpo2Critical ? `Low SpO2 ${spo2}` : ''})
              </div>
              <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>
                Recommendation: Assign Emergency Red Flag Priority to bypass regular waiting line.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPriority('EMERGENCY')}
            style={{
              background: 'var(--triage-emergency)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 1rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Apply Emergency Flag
          </button>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface-01)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '2rem',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Fast Auto-complete Phone Search */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Patient Mobile Number / Fast Lookup *
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="tel"
              required
              placeholder="Type mobile number or name (e.g. 9840112345)..."
              value={phoneSearch}
              onChange={(e) => handlePhoneInputChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-strong)',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-data)'
              }}
            />
          </div>

          {/* Auto-complete dropdown */}
          {matchingPatients.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0, right: 0,
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              boxShadow: 'var(--shadow-raised)',
              zIndex: 50,
              marginTop: '4px',
              overflow: 'hidden'
            }}>
              {matchingPatients.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => selectPatientSuggestion(p)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.phone} • {p.age}y / {p.gender}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)', background: '#e0f2fe', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    Auto-Fill Profile ↵
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demographics */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Patient Full Name *
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
        </div>

        {/* Department & Triage Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              OPD Department
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                const doc = doctors.find((d) => d.department === e.target.value);
                if (doc) setDoctorId(doc.id);
              }}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: '#fff' }}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              Doctor
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: '#fff' }}
            >
              {doctors.filter((d) => d.department === department).map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.roomNo})</option>
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
                border: priority === 'EMERGENCY' ? '2px solid var(--triage-emergency)' : '1px solid var(--border-strong)',
                background: priority === 'EMERGENCY' ? 'var(--triage-emergency-bg)' : '#ffffff',
                color: priority === 'EMERGENCY' ? 'var(--triage-emergency)' : 'var(--text-primary)',
                fontWeight: 800
              }}
            >
              <option value="NORMAL">Regular OPD (Standard Line)</option>
              <option value="SENIOR">Senior Citizen / Pediatric Priority</option>
              <option value="EMERGENCY">🚨 Emergency Red Flag (Top of Queue)</option>
            </select>
          </div>
        </div>

        {/* Triage Vitals with Out-of-Range Highlights */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Triage Vitals (Real-time Range Validation)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>BP (mmHg)</span>
              <input
                type="text"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isBpCritical ? '2px solid var(--triage-emergency)' : '1px solid var(--border-strong)',
                  background: isBpCritical ? 'var(--triage-emergency-bg)' : '#ffffff',
                  fontWeight: 700
                }}
              />
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pulse (bpm)</span>
              <input type="text" value={pulse} onChange={(e) => setPulse(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} />
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>SpO2 (%)</span>
              <input
                type="text"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSpo2Critical ? '2px solid var(--triage-emergency)' : '1px solid var(--border-strong)',
                  background: isSpo2Critical ? 'var(--triage-emergency-bg)' : '#ffffff',
                  fontWeight: 700
                }}
              />
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Temp (°F)</span>
              <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} />
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Weight (kg)</span>
              <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }} />
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            Presenting Symptoms & Chief Complaints
          </label>
          <input
            type="text"
            placeholder="e.g. Chest pain with sweating, high fever for 3 days"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: 'var(--brand-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.95rem',
            fontWeight: 800,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <UserPlus size={19} />
          <span>Generate Token & Print 80mm Receipt</span>
        </button>
      </form>
    </div>
  );
};
