export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
  PATIENT: 'PATIENT'
};

export const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology', code: 'CARD', floor: '2nd Floor', roomStart: 201, icon: 'HeartPulse', head: 'Dr. Sarah Jenkins' },
  { id: 'general', name: 'General Medicine', code: 'GEN', floor: 'Ground Floor', roomStart: 101, icon: 'Stethoscope', head: 'Dr. Robert Vance' },
  { id: 'orthopedics', name: 'Orthopedics', code: 'ORTHO', floor: '1st Floor', roomStart: 112, icon: 'Bone', head: 'Dr. Rajesh Nair' },
  { id: 'pediatrics', name: 'Pediatrics', code: 'PED', floor: '1st Floor', roomStart: 108, icon: 'Baby', head: 'Dr. Elena Rostova' },
  { id: 'dermatology', name: 'Dermatology', code: 'DERM', floor: '3rd Floor', roomStart: 305, icon: 'Sparkles', head: 'Dr. Ananya Iyer' },
  { id: 'neurology', name: 'Neurology', code: 'NEURO', floor: '4th Floor', roomStart: 401, icon: 'Activity', head: 'Dr. David Cho' }
];

export const TOKEN_STATUS = {
  WAITING: 'WAITING',
  IN_CONSULTATION: 'IN_CONSULTATION',
  COMPLETED: 'COMPLETED',
  HOLD: 'HOLD',
  NO_SHOW: 'NO_SHOW',
  CANCELLED: 'CANCELLED'
};

export const TRIAGE_PRIORITIES = {
  EMERGENCY: { id: 'EMERGENCY', label: 'Emergency (Red)', color: '#dc2626', bg: '#fef2f2', weight: 3 },
  SENIOR: { id: 'SENIOR', label: 'Senior Citizen / Child', color: '#d97706', bg: '#fffbeb', weight: 2 },
  NORMAL: { id: 'NORMAL', label: 'Regular OPD', color: '#0284c7', bg: '#f0f9ff', weight: 1 }
};

export const INITIAL_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    qualification: 'MD, DM (Cardiology), FACC',
    department: 'cardiology',
    deptName: 'Cardiology',
    roomNo: 'Room 204',
    status: 'AVAILABLE',
    avgConsultTimeMin: 12,
    todayConsulted: 18,
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-2',
    name: 'Dr. Robert Vance',
    qualification: 'MBBS, MD (General Medicine)',
    department: 'general',
    deptName: 'General Medicine',
    roomNo: 'Room 102',
    status: 'AVAILABLE',
    avgConsultTimeMin: 8,
    todayConsulted: 29,
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-3',
    name: 'Dr. Rajesh Nair',
    qualification: 'MS (Ortho), MCh (Joint Replacement)',
    department: 'orthopedics',
    deptName: 'Orthopedics',
    roomNo: 'Room 115',
    status: 'AVAILABLE',
    avgConsultTimeMin: 15,
    todayConsulted: 14,
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-4',
    name: 'Dr. Elena Rostova',
    qualification: 'MD (Pediatrics), DCH',
    department: 'pediatrics',
    deptName: 'Pediatrics',
    roomNo: 'Room 109',
    status: 'AVAILABLE',
    avgConsultTimeMin: 10,
    todayConsulted: 22,
    photoUrl: 'https://images.unsplash.com/photo-1594824813581-22442491176b?auto=format&fit=crop&q=80&w=300'
  }
];

export const INITIAL_QUEUES = [
  {
    id: 'tok-101',
    tokenNumber: 'CARD-101',
    patientName: 'Karthik Ramanathan',
    phone: '9840112345',
    age: 54,
    gender: 'Male',
    department: 'cardiology',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    roomNo: 'Room 204',
    priority: 'EMERGENCY',
    status: 'IN_CONSULTATION',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 5 * 60000).toISOString(),
    symptoms: 'Chest pain radiating to left arm, shortness of breath',
    vitals: { bp: '145/95', pulse: '88', spo2: '97%', temp: '98.4 F', weight: '76 kg' }
  },
  {
    id: 'tok-102',
    tokenNumber: 'CARD-102',
    patientName: 'Meenakshi Sundaram',
    phone: '9840198765',
    age: 68,
    gender: 'Female',
    department: 'cardiology',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    roomNo: 'Room 204',
    priority: 'SENIOR',
    status: 'WAITING',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    symptoms: 'Routine hypertension review, occasional dizziness',
    vitals: { bp: '138/86', pulse: '72', spo2: '99%', temp: '98.2 F', weight: '62 kg' }
  },
  {
    id: 'tok-103',
    tokenNumber: 'CARD-103',
    patientName: 'Vignesh Kumar',
    phone: '9444155667',
    age: 32,
    gender: 'Male',
    department: 'cardiology',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    roomNo: 'Room 204',
    priority: 'NORMAL',
    status: 'WAITING',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    symptoms: 'Pre-employment health checkup ECG abnormality',
    vitals: { bp: '120/80', pulse: '76', spo2: '99%', temp: '98.6 F', weight: '70 kg' }
  },
  {
    id: 'tok-201',
    tokenNumber: 'GEN-201',
    patientName: 'Priya Dharshini',
    phone: '9790812344',
    age: 27,
    gender: 'Female',
    department: 'general',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Vance',
    roomNo: 'Room 102',
    priority: 'NORMAL',
    status: 'IN_CONSULTATION',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 4 * 60000).toISOString(),
    symptoms: 'High fever for 3 days, body ache, mild chills',
    vitals: { bp: '118/78', pulse: '92', spo2: '98%', temp: '101.8 F', weight: '55 kg' }
  },
  {
    id: 'tok-202',
    tokenNumber: 'GEN-202',
    patientName: 'Suresh Chandran',
    phone: '9841023456',
    age: 45,
    gender: 'Male',
    department: 'general',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Vance',
    roomNo: 'Room 102',
    priority: 'NORMAL',
    status: 'WAITING',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    symptoms: 'Acidity, persistent cough and sore throat',
    vitals: { bp: '128/84', pulse: '80', spo2: '98%', temp: '98.6 F', weight: '82 kg' }
  },
  {
    id: 'tok-301',
    tokenNumber: 'ORTHO-301',
    patientName: 'Balaji G.',
    phone: '9884011223',
    age: 51,
    gender: 'Male',
    department: 'orthopedics',
    doctorId: 'doc-3',
    doctorName: 'Dr. Rajesh Nair',
    roomNo: 'Room 115',
    priority: 'NORMAL',
    status: 'IN_CONSULTATION',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 7 * 60000).toISOString(),
    symptoms: 'Severe knee pain on climbing stairs, morning stiffness',
    vitals: { bp: '130/85', pulse: '74', spo2: '98%', temp: '98.4 F', weight: '88 kg' }
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: 'rx-9001',
    tokenNumber: 'CARD-098',
    patientName: 'Anand Gopal',
    patientAge: 62,
    patientGender: 'Male',
    doctorName: 'Dr. Sarah Jenkins',
    deptName: 'Cardiology',
    date: '2026-08-29',
    diagnosis: 'Essential Hypertension, Grade II + Dyslipidemia',
    vitals: { bp: '150/92', pulse: '80', spo2: '98%', temp: '98.4 F', weight: '78 kg' },
    medicines: [
      { name: 'Telmisartan 40mg', dosage: '1 tab', freq: '1-0-0 (Morning)', duration: '30 Days', instruction: 'After breakfast' },
      { name: 'Atorvastatin 10mg', dosage: '1 tab', freq: '0-0-1 (Night)', duration: '30 Days', instruction: 'After dinner' },
      { name: 'Amlodipine 5mg', dosage: '1 tab', freq: '0-1-0 (Noon)', duration: '15 Days', instruction: 'After food' }
    ],
    advice: 'Low salt diet (< 3g/day). 30 mins brisk walking daily. Review after 1 month with lipid profile.',
    pdfUrl: '#'
  }
];
