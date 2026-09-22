# ==============================================================================
# MediQueue Pro (MQP) - Enterprise Database Schema & Initial Seeding
# Database: MQP (PostgreSQL 15+)
# ==============================================================================

-- Clean slate if needed
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS prescription_medicines CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_schedules CASCADE;
DROP TABLE IF EXISTS vitals CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE (Authentication & Base Profile)
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')),
    phone VARCHAR(20),
    title VARCHAR(100),
    pin VARCHAR(10) DEFAULT '1234',
    avatar VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE departments (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    wing VARCHAR(50) NOT NULL,
    color VARCHAR(30) DEFAULT '#0284c7',
    icon VARCHAR(50) DEFAULT 'Heart',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DOCTORS TABLE
CREATE TABLE doctors (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    qualification VARCHAR(255) NOT NULL,
    experience_years INT DEFAULT 1,
    room_no VARCHAR(50) NOT NULL,
    consultation_fee NUMERIC(10, 2) DEFAULT 500.00,
    avg_consult_time_mins INT DEFAULT 12,
    status VARCHAR(30) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'IN_CONSULTATION', 'ON_BREAK', 'OFF_DUTY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PATIENTS TABLE (EHR & Demographic Profile)
CREATE TABLE patients (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    mrn VARCHAR(30) UNIQUE NOT NULL, -- Medical Record Number e.g. MQP-2026-8821
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    address TEXT,
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(20),
    allergies TEXT,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. VITALS TABLE (Triage Record)
CREATE TABLE vitals (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    systolic_bp INT,
    diastolic_bp INT,
    heart_rate INT,
    respiratory_rate INT,
    temperature NUMERIC(4, 1),
    spo2 INT,
    weight_kg NUMERIC(5, 2),
    height_cm NUMERIC(5, 2),
    bmi NUMERIC(4, 1),
    blood_glucose INT,
    triage_priority VARCHAR(20) DEFAULT 'STANDARD' CHECK (triage_priority IN ('STANDARD', 'URGENT', 'EMERGENCY')),
    recorded_by VARCHAR(64) REFERENCES users(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TOKENS TABLE (Live OPD Queue)
CREATE TABLE tokens (
    id VARCHAR(64) PRIMARY KEY,
    token_number VARCHAR(30) NOT NULL, -- e.g. CARD-101
    sequence_num INT NOT NULL,
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id),
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    vitals_id VARCHAR(64) REFERENCES vitals(id),
    status VARCHAR(30) DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED', 'SKIPPED', 'CANCELLED')),
    triage_priority VARCHAR(20) DEFAULT 'STANDARD' CHECK (triage_priority IN ('STANDARD', 'URGENT', 'EMERGENCY')),
    queue_date DATE DEFAULT CURRENT_DATE,
    estimated_wait_mins INT DEFAULT 15,
    called_at TIMESTAMP WITH TIME ZONE,
    consultation_start_at TIMESTAMP WITH TIME ZONE,
    consultation_end_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PRESCRIPTIONS TABLE
CREATE TABLE prescriptions (
    id VARCHAR(64) PRIMARY KEY,
    prescription_no VARCHAR(50) UNIQUE NOT NULL,
    token_id VARCHAR(64) REFERENCES tokens(id),
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id),
    diagnosis TEXT NOT NULL,
    clinical_notes TEXT,
    follow_up_date DATE,
    advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PRESCRIPTION MEDICINES
CREATE TABLE prescription_medicines (
    id VARCHAR(64) PRIMARY KEY,
    prescription_id VARCHAR(64) NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL, -- e.g. 500mg
    frequency VARCHAR(50) NOT NULL, -- e.g. 1-0-1 (Morning-Night)
    duration_days INT NOT NULL, -- e.g. 5
    instructions VARCHAR(150) -- e.g. After Food
);

-- 9. DOCTOR SCHEDULES
CREATE TABLE doctor_schedules (
    id VARCHAR(64) PRIMARY KEY,
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    shift_name VARCHAR(50) NOT NULL, -- e.g. Morning OPD, Evening OPD
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_tokens INT DEFAULT 30,
    is_available BOOLEAN DEFAULT TRUE
);

-- 10. NOTIFICATIONS
CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tokens_dept_status ON tokens(department_id, status, queue_date);
CREATE INDEX idx_tokens_doctor_status ON tokens(doctor_id, status, queue_date);
CREATE INDEX idx_patients_mrn_phone ON patients(mrn, phone);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
