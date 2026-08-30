import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Save,
  CheckCircle2,
  Sparkles,
  Printer,
  Stethoscope
} from 'lucide-react';

const COMMON_DRUGS = [
  { name: 'Paracetamol 650mg', dosage: '1 tab', freq: '1-0-1 (Twice daily)', duration: '5 Days', instruction: 'After food' },
  { name: 'Amoxicillin + Clavulanic Acid 625mg', dosage: '1 tab', freq: '1-0-1 (Twice daily)', duration: '5 Days', instruction: 'After food' },
  { name: 'Pantoprazole 40mg', dosage: '1 tab', freq: '1-0-0 (Morning)', duration: '10 Days', instruction: '30 mins before breakfast' },
  { name: 'Cetirizine 10mg', dosage: '1 tab', freq: '0-0-1 (Night)', duration: '5 Days', instruction: 'At bedtime' },
  { name: 'Telmisartan 40mg', dosage: '1 tab', freq: '1-0-0 (Morning)', duration: '30 Days', instruction: 'After breakfast' },
  { name: 'Metformin 500mg SR', dosage: '1 tab', freq: '1-0-1 (Twice daily)', duration: '30 Days', instruction: 'With meals' },
  { name: 'Atorvastatin 10mg', dosage: '1 tab', freq: '0-0-1 (Night)', duration: '30 Days', instruction: 'After dinner' }
];

export const PrescriptionBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { savePrescription, queues } = useQueue();

  const tokenParam = searchParams.get('token') || 'CARD-101';
  const patientParam = searchParams.get('patient') || 'Karthik Ramanathan';

  // Try matching active token info
  const matchedToken = queues.find((q) => q.tokenNumber === tokenParam);

  const [patientName, setPatientName] = useState(matchedToken ? matchedToken.patientName : patientParam);
  const [patientAge, setPatientAge] = useState(matchedToken ? matchedToken.age : 54);
  const [patientGender, setPatientGender] = useState(matchedToken ? matchedToken.gender : 'Male');
  const [tokenNumber, setTokenNumber] = useState(tokenParam);
  const [diagnosis, setDiagnosis] = useState('Acute Bronchitis & Moderate Systemic Hypertension');
  const [advice, setAdvice] = useState('Drink adequate warm water. Avoid dusty environment and cold beverages. Review in OPD after 5 days or SOS if fever spikes.');

  const [medicines, setMedicines] = useState([
    { name: 'Amoxicillin + Clavulanic Acid 625mg', dosage: '1 tab', freq: '1-0-1 (Twice daily)', duration: '5 Days', instruction: 'After food' },
    { name: 'Paracetamol 650mg', dosage: '1 tab', freq: '1-1-1 (Thrice daily)', duration: '3 Days', instruction: 'After meals for fever' },
    { name: 'Pantoprazole 40mg', dosage: '1 tab', freq: '1-0-0 (Morning)', duration: '7 Days', instruction: 'Before breakfast' }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '1 tab', freq: '1-0-1', duration: '5 Days', instruction: 'After food' }
    ]);
  };

  const handleQuickAdd = (drug) => {
    setMedicines([...medicines, { ...drug }]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const getPrescriptionPayload = () => ({
    tokenNumber,
    patientName,
    patientAge,
    patientGender,
    doctorName: user?.name || 'Dr. Sarah Jenkins',
    deptName: user?.deptName || 'Cardiology',
    vitals: matchedToken?.vitals || { bp: '130/84', pulse: '78', spo2: '98%', temp: '98.6 F' },
    diagnosis,
    medicines,
    advice,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSaveAndPDF = () => {
    const rxPayload = getPrescriptionPayload();
    savePrescription(rxPayload);
    generatePrescriptionPDF(rxPayload);
    setIsSaved(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Digital Prescription (Rx) Builder
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            NABH Standard Electronic Medical Prescription & Instant PDF Generator
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleSaveAndPDF}
            style={{
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Download size={18} />
            <span>Generate & Download PDF Rx</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#16a34a',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} />
          <span>Prescription successfully saved to Patient Health Record and PDF downloaded!</span>
        </div>
      )}

      {/* Main Form Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Rx Details & Medicine Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Patient Details Strip */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                PATIENT NAME
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  fontWeight: 600
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                AGE / GENDER
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    fontWeight: 600
                  }}
                />
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    fontWeight: 600
                  }}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                TOKEN REF NUMBER
              </label>
              <input
                type="text"
                value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 700,
                  color: 'var(--primary-700)'
                }}
              />
            </div>
          </div>

          {/* Clinical Diagnosis Input */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem'
          }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Clinical Diagnosis & Findings
            </label>
            <textarea
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Essential Hypertension Grade II, Upper Respiratory Tract Infection"
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Medicine List Repeater */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-600)', fontFamily: 'serif' }}>Rx</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Prescribed Medications</span>
              </div>

              <button
                type="button"
                onClick={handleAddMedicine}
                style={{
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-300)',
                  color: 'var(--primary-700)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Plus size={16} />
                <span>Add Drug</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {medicines.map((drug, index) => (
                <div
                  key={index}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1.5fr 36px',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}
                >
                  <input
                    type="text"
                    placeholder="Medicine Name & Strength"
                    value={drug.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-strong)', fontSize: '0.85rem', fontWeight: 600 }}
                  />

                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1 tab)"
                    value={drug.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                  />

                  <input
                    type="text"
                    placeholder="Freq (1-0-1)"
                    value={drug.freq}
                    onChange={(e) => handleMedicineChange(index, 'freq', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                  />

                  <input
                    type="text"
                    placeholder="Duration"
                    value={drug.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                  />

                  <input
                    type="text"
                    placeholder="Instructions (e.g. After food)"
                    value={drug.instruction}
                    onChange={(e) => handleMedicineChange(index, 'instruction', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(index)}
                    title="Remove drug"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      padding: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Lifestyle Guidelines */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem'
          }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Special Advice / Dietary & Follow-up Instructions
            </label>
            <textarea
              rows={3}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="e.g. Low salt diet, 30 min brisk walk, review in 7 days."
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Right Column: Quick Formulary / Common Rx Presets */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Quick Hospital Formulary (1-Click Add)
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Common OPD prescriptions based on hospital pharmacopoeia:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {COMMON_DRUGS.map((drug, idx) => (
              <div
                key={idx}
                onClick={() => handleQuickAdd(drug)}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-400)';
                  e.currentTarget.style.background = 'var(--primary-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  + {drug.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {drug.dosage} • {drug.freq} • {drug.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
