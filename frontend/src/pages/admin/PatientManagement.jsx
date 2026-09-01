import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import {
  Users,
  Search,
  FileText,
  Clock,
  HeartPulse,
  Activity,
  Calendar,
  Phone,
  Shield,
  Stethoscope,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  History,
  Pill,
  Download,
  X
} from 'lucide-react';

// Seed detailed Electronic Health Records (EHR) & Consultation History for Patients
const INITIAL_PATIENTS = [
  {
    id: 'pat-1001',
    patientId: 'PID-8942',
    name: 'Karthik Ramanathan',
    phone: '9840112345',
    email: 'karthik.r@example.com',
    age: 54,
    gender: 'Male',
    bloodGroup: 'B+ve',
    emergencyContact: '+91 94441 55667 (Brother)',
    address: '42, Besant Nagar, Chennai - 600090',
    totalVisits: 5,
    firstRegistered: '2025-11-12',
    lastVisit: '2026-08-30',
    status: 'ACTIVE_OPD',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicConditions: ['Hypertension Grade II', 'Hyperlipidemia'],
    vitalsHistory: [
      { date: '2026-08-30', bp: '145/95', pulse: '88', spo2: '97%', temp: '98.4 F', weight: '76 kg', recordedBy: 'Triage Desk 1' },
      { date: '2026-08-10', bp: '138/88', pulse: '80', spo2: '99%', temp: '98.6 F', weight: '76.5 kg', recordedBy: 'OPD Desk' },
      { date: '2026-06-15', bp: '150/98', pulse: '92', spo2: '98%', temp: '98.2 F', weight: '77 kg', recordedBy: 'Emergency Triage' }
    ],
    consultationHistory: [
      {
        id: 'vis-1',
        tokenNumber: 'CARD-101',
        date: '2026-08-30',
        doctorName: 'Dr. Sarah Jenkins',
        department: 'Cardiology',
        roomNo: 'Room 204',
        diagnosis: 'Chest pain radiating to left arm, shortness of breath on exertion',
        clinicalNotes: 'ECG showed ST elevation in lateral leads. Prescribed Telmisartan and Atorvastatin. Advised Echo and lipid profile review in 2 weeks.',
        rxMedicines: [
          { name: 'Telmisartan 40mg', dosage: '1 tab', freq: '1-0-0', duration: '30 Days', instruction: 'After breakfast' },
          { name: 'Atorvastatin 10mg', dosage: '1 tab', freq: '0-0-1', duration: '30 Days', instruction: 'After dinner' },
          { name: 'Aspirin 75mg', dosage: '1 tab', freq: '0-1-0', duration: '30 Days', instruction: 'After food' }
        ]
      },
      {
        id: 'vis-2',
        tokenNumber: 'CARD-098',
        date: '2026-08-10',
        doctorName: 'Dr. Sarah Jenkins',
        department: 'Cardiology',
        roomNo: 'Room 204',
        diagnosis: 'Essential Hypertension routine followup',
        clinicalNotes: 'BP mildly elevated. Advised salt restriction and 30 mins aerobic walking.',
        rxMedicines: [
          { name: 'Telmisartan 40mg', dosage: '1 tab', freq: '1-0-0', duration: '30 Days', instruction: 'Morning after food' }
        ]
      },
      {
        id: 'vis-3',
        tokenNumber: 'GEN-142',
        date: '2026-06-15',
        doctorName: 'Dr. Robert Vance',
        department: 'General Medicine',
        roomNo: 'Room 102',
        diagnosis: 'Acute Gastritis & Acid Peptic Disease',
        clinicalNotes: 'Epigastric burning sensation. Antacid therapy initiated.',
        rxMedicines: [
          { name: 'Pantoprazole 40mg', dosage: '1 tab', freq: '1-0-0', duration: '14 Days', instruction: 'Before breakfast' }
        ]
      }
    ]
  },
  {
    id: 'pat-1002',
    patientId: 'PID-7821',
    name: 'Meenakshi Sundaram',
    phone: '9840198765',
    email: 'meenakshi.s@example.com',
    age: 68,
    gender: 'Female',
    bloodGroup: 'O+ve',
    emergencyContact: '+91 98401 22334 (Daughter)',
    address: '18, Anna Nagar West, Chennai - 600040',
    totalVisits: 8,
    firstRegistered: '2025-08-19',
    lastVisit: '2026-08-30',
    status: 'ACTIVE_OPD',
    allergies: ['No Known Drug Allergies (NKDA)'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Osteoarthritis Knees'],
    vitalsHistory: [
      { date: '2026-08-30', bp: '138/86', pulse: '72', spo2: '99%', temp: '98.2 F', weight: '62 kg', recordedBy: 'Triage Desk 1' },
      { date: '2026-07-22', bp: '130/80', pulse: '70', spo2: '99%', temp: '98.4 F', weight: '63 kg', recordedBy: 'OPD Desk' }
    ],
    consultationHistory: [
      {
        id: 'vis-101',
        tokenNumber: 'CARD-102',
        date: '2026-08-30',
        doctorName: 'Dr. Sarah Jenkins',
        department: 'Cardiology',
        roomNo: 'Room 204',
        diagnosis: 'Routine hypertension and diabetes cardiology review',
        clinicalNotes: 'Blood sugar fasting 128 mg/dL. Renal function tests normal. Continue current regimen.',
        rxMedicines: [
          { name: 'Metformin 500mg SR', dosage: '1 tab', freq: '1-0-1', duration: '60 Days', instruction: 'With meals' },
          { name: 'Glimepiride 1mg', dosage: '1 tab', freq: '1-0-0', duration: '60 Days', instruction: 'Before breakfast' }
        ]
      },
      {
        id: 'vis-102',
        tokenNumber: 'ORTHO-215',
        date: '2026-07-22',
        doctorName: 'Dr. Rajesh Nair',
        department: 'Orthopedics',
        roomNo: 'Room 115',
        diagnosis: 'Bilateral Knee Osteoarthritis Grade III',
        clinicalNotes: 'Advised knee strengthening physiotherapy and calcium supplements.',
        rxMedicines: [
          { name: 'Calcium + Vit D3', dosage: '1 tab', freq: '0-1-0', duration: '30 Days', instruction: 'After lunch' }
        ]
      }
    ]
  },
  {
    id: 'pat-1003',
    patientId: 'PID-6290',
    name: 'Priya Dharshini',
    phone: '9790812344',
    email: 'priya.dharshini@example.com',
    age: 27,
    gender: 'Female',
    bloodGroup: 'A+ve',
    emergencyContact: '+91 97908 55443 (Husband)',
    address: '89, Velachery Main Rd, Chennai - 600042',
    totalVisits: 3,
    firstRegistered: '2026-02-14',
    lastVisit: '2026-08-30',
    status: 'ACTIVE_OPD',
    allergies: ['NSAIDs (causes rash)'],
    chronicConditions: ['None'],
    vitalsHistory: [
      { date: '2026-08-30', bp: '118/78', pulse: '92', spo2: '98%', temp: '101.8 F', weight: '55 kg', recordedBy: 'Triage Desk 1' }
    ],
    consultationHistory: [
      {
        id: 'vis-201',
        tokenNumber: 'GEN-201',
        date: '2026-08-30',
        doctorName: 'Dr. Robert Vance',
        department: 'General Medicine',
        roomNo: 'Room 102',
        diagnosis: 'Acute Viral Pyrexia with upper respiratory symptoms',
        clinicalNotes: 'High fever for 3 days. Complete blood count ordered to rule out Dengue/Malaria.',
        rxMedicines: [
          { name: 'Paracetamol 650mg', dosage: '1 tab', freq: '1-1-1', duration: '3 Days', instruction: 'After food for fever' },
          { name: 'Cetirizine 10mg', dosage: '1 tab', freq: '0-0-1', duration: '5 Days', instruction: 'At bedtime' }
        ]
      }
    ]
  },
  {
    id: 'pat-1004',
    patientId: 'PID-5412',
    name: 'Balaji G.',
    phone: '9884011223',
    email: 'balaji.g@example.com',
    age: 51,
    gender: 'Male',
    bloodGroup: 'AB+ve',
    emergencyContact: '+91 98840 99887 (Wife)',
    address: '14, T. Nagar, Chennai - 600017',
    totalVisits: 4,
    firstRegistered: '2025-10-04',
    lastVisit: '2026-08-30',
    status: 'ACTIVE_OPD',
    allergies: ['No Known Drug Allergies'],
    chronicConditions: ['Lumbar Spondylosis'],
    vitalsHistory: [
      { date: '2026-08-30', bp: '130/85', pulse: '74', spo2: '98%', temp: '98.4 F', weight: '88 kg', recordedBy: 'Triage Desk 2' }
    ],
    consultationHistory: [
      {
        id: 'vis-301',
        tokenNumber: 'ORTHO-301',
        date: '2026-08-30',
        doctorName: 'Dr. Rajesh Nair',
        department: 'Orthopedics',
        roomNo: 'Room 115',
        diagnosis: 'Severe Knee pain on climbing stairs, Morning stiffness',
        clinicalNotes: 'X-Ray right knee shows joint space narrowing. Prescribed joint lubricants and topical analgesic.',
        rxMedicines: [
          { name: 'Glucosamine + Diacerein', dosage: '1 tab', freq: '1-0-0', duration: '30 Days', instruction: 'After food' }
        ]
      }
    ]
  },
  {
    id: 'pat-1005',
    patientId: 'PID-4399',
    name: 'Vignesh Kumar',
    phone: '9444155667',
    email: 'vignesh.k@example.com',
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+ve',
    emergencyContact: '+91 94441 00112 (Father)',
    address: '56, Adyar Bridge Rd, Chennai - 600020',
    totalVisits: 2,
    firstRegistered: '2026-04-10',
    lastVisit: '2026-08-30',
    status: 'WAITING_OPD',
    allergies: ['Dust / Pollen'],
    chronicConditions: ['Pre-Hypertension'],
    vitalsHistory: [
      { date: '2026-08-30', bp: '120/80', pulse: '76', spo2: '99%', temp: '98.6 F', weight: '70 kg', recordedBy: 'Triage Desk 1' }
    ],
    consultationHistory: [
      {
        id: 'vis-401',
        tokenNumber: 'CARD-103',
        date: '2026-08-30',
        doctorName: 'Dr. Sarah Jenkins',
        department: 'Cardiology',
        roomNo: 'Room 204',
        diagnosis: 'Pre-employment health checkup ECG abnormality evaluation',
        clinicalNotes: 'Sinus arrhythmia observed, benign variant. Fitness certificate granted.',
        rxMedicines: [
          { name: 'Multivitamin + Zinc', dosage: '1 tab', freq: '0-1-0', duration: '30 Days', instruction: 'After lunch' }
        ]
      }
    ]
  }
];

export const PatientManagement = () => {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [activePatientDetails, setActivePatientDetails] = useState(null); // When a patient row/card is clicked

  // Filter logic
  const filteredPatients = patients.filter((p) => {
    const matchesGender = selectedGender === 'ALL' || p.gender === selectedGender;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.bloodGroup && p.bloodGroup.toLowerCase().includes(q));
    return matchesGender && matchesSearch;
  });

  const handleDownloadRx = (visit, patient) => {
    const rxPayload = {
      tokenNumber: visit.tokenNumber,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      doctorName: visit.doctorName,
      deptName: visit.department,
      date: visit.date,
      diagnosis: visit.diagnosis,
      advice: visit.clinicalNotes,
      medicines: visit.rxMedicines || [],
      vitals: patient.vitalsHistory?.[0] || { bp: '120/80', pulse: '76', spo2: '99%', temp: '98.6 F' }
    };
    generatePrescriptionPDF(rxPayload);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1250px', margin: '0 auto' }}>
      {/* Top Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0b4175 0%, #0369a1 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '0.9rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex'
          }}>
            <Users size={36} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                Patient Health Records & Clinical History
              </h1>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                {patients.length} Registered Patients
              </span>
            </div>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.88rem', color: '#e0f2fe' }}>
              Search patient profiles by Patient ID, Mobile or Name. Click on any patient to inspect complete OPD consultation history, triage vitals, and download previous digital prescriptions.
            </p>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div style={{
        background: 'var(--surface-01)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '460px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Patient ID (e.g. PID-8942), Name, Phone, or Blood Group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.4rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Gender Filter:</span>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              background: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            <option value="ALL">All Genders ({patients.length})</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div style={{
        background: 'var(--surface-01)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface-02)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PATIENT ID</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PATIENT NAME & CONTACT</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>AGE / GENDER</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>BLOOD GROUP</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>CHRONIC CONDITIONS</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>VISITS</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'background 120ms ease'
                }}
                onClick={() => setActivePatientDetails(patient)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-light)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: 'var(--brand-primary)',
                    background: '#e0f2fe',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    border: '1px solid #bae6fd'
                  }}>
                    {patient.patientId}
                  </span>
                </td>

                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {patient.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={12} />
                    <span>{patient.phone}</span>
                  </div>
                </td>

                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {patient.age} Yrs • {patient.gender}
                </td>

                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {patient.bloodGroup}
                  </span>
                </td>

                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {patient.chronicConditions.map((cond, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'var(--surface-02)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.72rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                          fontWeight: 600
                        }}
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                </td>

                <td style={{ padding: '1rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)'
                  }}>
                    {patient.totalVisits} OPD Visits
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Last: {patient.lastVisit}
                  </div>
                </td>

                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePatientDetails(patient);
                    }}
                    style={{
                      background: 'var(--brand-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span>View History</span>
                    <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient Detailed EHR & History Slide-over / Modal */}
      {activePatientDetails && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.25rem'
          }}
        >
          <div style={{
            background: 'var(--surface-01)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-raised)',
            border: '1px solid var(--border-subtle)',
            padding: '2rem',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setActivePatientDetails(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--surface-02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Patient Header Card */}
            <div style={{
              background: 'linear-gradient(135deg, var(--brand-light), #e0f2fe)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid #bae6fd',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    color: 'var(--brand-primary)',
                    background: '#ffffff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    border: '1px solid #bae6fd'
                  }}>
                    {activePatientDetails.patientId}
                  </span>
                  <span style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px'
                  }}>
                    NABH VERIFIED EHR
                  </span>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                  {activePatientDetails.name}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {activePatientDetails.age} Yrs • {activePatientDetails.gender} • Blood Group: <strong style={{ color: '#dc2626' }}>{activePatientDetails.bloodGroup}</strong> • Mobile: <strong>{activePatientDetails.phone}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-dark)' }}>REGISTERED ADDRESS</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, maxWidth: '240px' }}>
                  {activePatientDetails.address}
                </div>
              </div>
            </div>

            {/* Medical Summary: Allergies & Chronic Conditions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--triage-emergency-bg)', border: '1px solid var(--triage-emergency-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--triage-emergency)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertTriangle size={15} />
                  <span>Documented Drug Allergies</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#991b1b' }}>
                  {activePatientDetails.allergies.join(', ')}
                </div>
              </div>

              <div style={{ background: 'var(--surface-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <HeartPulse size={15} />
                  <span>Chronic Medical Conditions</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activePatientDetails.chronicConditions.join(', ')}
                </div>
              </div>
            </div>

            {/* Section 1: Past OPD Consultations & Diagnosis Timeline */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={20} color="var(--brand-primary)" />
                <span>Consultation Timeline & Diagnosis History ({activePatientDetails.consultationHistory.length})</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activePatientDetails.consultationHistory.map((visit, idx) => (
                  <div
                    key={visit.id || idx}
                    style={{
                      background: 'var(--surface-01)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.25rem',
                      boxShadow: 'var(--shadow-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontFamily: 'var(--font-data)',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            color: 'var(--brand-primary)',
                            background: 'var(--brand-light)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {visit.tokenNumber}
                          </span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {visit.department} • {visit.doctorName}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({visit.roomNo})</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Consultation Date: <strong>{visit.date}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadRx(visit, activePatientDetails)}
                        style={{
                          background: 'var(--brand-primary)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={13} />
                        <span>Download Prescription PDF</span>
                      </button>
                    </div>

                    {/* Diagnosis & Findings */}
                    <div style={{ background: 'var(--surface-02)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark)', textTransform: 'uppercase' }}>
                        Clinical Diagnosis:
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {visit.diagnosis}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Notes: {visit.clinicalNotes}
                      </div>
                    </div>

                    {/* Prescribed Drugs */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Medications Prescribed:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {visit.rxMedicines.map((med, mIdx) => (
                          <div
                            key={mIdx}
                            style={{
                              background: '#ffffff',
                              border: '1px solid var(--border-strong)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.78rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <Pill size={12} color="var(--brand-primary)" />
                            <strong>{med.name}</strong>
                            <span style={{ color: 'var(--text-secondary)' }}>({med.dosage} • {med.freq} • {med.duration})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Vitals Timeline Table */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} color="var(--brand-primary)" />
                <span>Historical Vitals Records</span>
              </h3>

              <div style={{ background: 'var(--surface-02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>RECORDED DATE</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>BLOOD PRESSURE</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PULSE</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SpO2</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TEMP</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>WEIGHT</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>STATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePatientDetails.vitalsHistory.map((vit, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>{vit.date}</td>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-data)' }}>{vit.bp}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{vit.pulse} bpm</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: '#16a34a', fontWeight: 700 }}>{vit.spo2}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{vit.temp}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{vit.weight}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>{vit.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
