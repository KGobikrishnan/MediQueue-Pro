-- ==============================================================================
-- MediQueue Pro (MQP) - Seed Data for Live OPD Environment
-- ==============================================================================

-- 1. SEED USERS
-- Default BCrypt password for 'password123': $2a$10$e8wzYc/e3L/H2U00B5B2t.0iM/UuQd4wN4gI7gY7V07C.9y5X1r0O
-- For convenience and fallback, cleartext check supported in custom auth filter or hashed
INSERT INTO users (id, name, email, password, role, phone, title, pin, avatar) VALUES
('usr-admin-1', 'Dr. Arthur Sterling', 'admin@mediqueue.pro', '$2a$10$wN9Q7bK4JzF2lV.3t3YkIe0s8j5t0Pq7k5s4t2w1e0r9y8u7i6o5p', 'ADMIN', '9840100001', 'Hospital Medical Director & Admin', '1234', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'),
('usr-doc-1', 'Dr. Sarah Jenkins', 'sarah.jenkins@mediqueue.pro', '$2a$10$wN9Q7bK4JzF2lV.3t3YkIe0s8j5t0Pq7k5s4t2w1e0r9y8u7i6o5p', 'DOCTOR', '9840100002', 'Senior Interventional Cardiologist', '1234', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'),
('usr-doc-2', 'Dr. Rajesh Khanna', 'rajesh.khanna@mediqueue.pro', '$2a$10$wN9Q7bK4JzF2lV.3t3YkIe0s8j5t0Pq7k5s4t2w1e0r9y8u7i6o5p', 'DOCTOR', '9840100003', 'Head of Neurology & Stroke Care', '1234', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'),
('usr-doc-3', 'Dr. Anita Desai', 'anita.desai@mediqueue.pro', '$2a$10$wN9Q7bK4JzF2lV.3t3YkIe0s8j5t0Pq7k5s4t2w1e0r9y8u7i6o5p', 'DOCTOR', '9840100004', 'Lead Orthopedic & Trauma Surgeon', '1234', 'https://images.unsplash.com/photo-1594824813512-51c6c8bc59e9?auto=format&fit=crop&q=80&w=200'),
('usr-doc-4', 'Dr. Michael Chang', 'michael.chang@mediqueue.pro', '$2a$10$wN9Q7bK4JzF2lV.3t3YkIe0s8j5t0Pq7k5s4t2w1e0r9y8u7i6o5p', 'DOCTOR', '9840100005', 'Consultant Pulmonologist & Critical Care', '1234', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'),
('usr-rec-1', 'Kavitha Ramaswamy', 'reception.opd@mediqueue.pro', '$2a$10$wN9Q7bK4JzF2lV.3t3YkIe0s8j5t0Pq7k5s4t2w1e0r9y8u7i6o5p', 'RECEPTIONIST', '9840100006', 'Chief OPD Desk Coordinator', '1234', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'),
('usr-pat-1', 'Karthik Ramanathan', 'karthik.r@example.com', '$2a$10$wN9Q7bK4JzF2lV.3t3YkIe0s8j5t0Pq7k5s4t2w1e0r9y8u7i6o5p', 'PATIENT', '9840112345', 'Verified Patient', '1234', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED DEPARTMENTS
INSERT INTO departments (id, code, name, floor, wing, color, icon, description) VALUES
('dept-cardio', 'CARD', 'Cardiology', '2nd Floor', 'East Wing', '#e11d48', 'Heart', 'Comprehensive adult & pediatric heart care and non-invasive diagnostics'),
('dept-neuro', 'NEUR', 'Neurology', '3rd Floor', 'North Wing', '#7c3aed', 'Brain', 'Advanced neurological diagnosis, EEG, EMG and stroke management'),
('dept-ortho', 'ORTH', 'Orthopedics', '1st Floor', 'West Wing', '#0284c7', 'Bone', 'Joint replacements, trauma, sports injury rehab and bone density scan'),
('dept-pulmo', 'PULM', 'Pulmonology', '2nd Floor', 'South Wing', '#059669', 'Activity', 'Respiratory disorders, spirometry, asthma and sleep apnea diagnostics')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED DOCTORS
INSERT INTO doctors (id, user_id, department_id, qualification, experience_years, room_no, consultation_fee, avg_consult_time_mins, status) VALUES
('doc-1', 'usr-doc-1', 'dept-cardio', 'MBBS, MD, DM (Cardiology), FACC', 14, 'Room 204', 800.00, 12, 'AVAILABLE'),
('doc-2', 'usr-doc-2', 'dept-neuro', 'MBBS, MD, DM (Neurology)', 18, 'Room 312', 900.00, 15, 'AVAILABLE'),
('doc-3', 'usr-doc-3', 'dept-ortho', 'MBBS, MS (Orthopedics), MCh', 11, 'Room 108', 750.00, 10, 'AVAILABLE'),
('doc-4', 'usr-doc-4', 'dept-pulmo', 'MBBS, MD (Pulmonary Med), FCCP', 16, 'Room 215', 700.00, 14, 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED PATIENTS
INSERT INTO patients (id, user_id, mrn, full_name, phone, email, age, gender, blood_group, address, emergency_contact_name, emergency_contact_phone, allergies, medical_history) VALUES
('pat-1', 'usr-pat-1', 'MQP-2026-8821', 'Karthik Ramanathan', '9840112345', 'karthik.r@example.com', 54, 'Male', 'B+', '42 Gandhi Nagar, Chennai', 'Sudha Ramanathan', '9840199887', 'Penicillin', 'Essential Hypertension (5 yrs), Mild hyperlipidemia'),
('pat-2', NULL, 'MQP-2026-9042', 'Meenakshi Sundaram', '9840223456', 'meenakshi.s@example.com', 46, 'Female', 'O+', '12 Anna Salai, Chennai', 'Sundaram K', '9840299881', 'Sulfa drugs', 'Type 2 Diabetes Mellitus'),
('pat-3', NULL, 'MQP-2026-7719', 'Rohan Verghese', '9840334567', 'rohan.v@example.com', 29, 'Male', 'A+', '89 T. Nagar, Chennai', 'George Verghese', '9840399882', 'None', 'Asthma triggered by seasonal dust'),
('pat-4', NULL, 'MQP-2026-6104', 'Ananya Deshmukh', '9840445678', 'ananya.d@example.com', 38, 'Female', 'AB+', '104 Velachery Main Rd, Chennai', 'Vikram Deshmukh', '9840499883', 'Aspirin', 'Occasional Migraine with aura'),
('pat-5', NULL, 'MQP-2026-5590', 'Balamurugan Pillai', '9840556789', 'bala.p@example.com', 62, 'Male', 'O-', '23 Adyar, Chennai', 'Murugan B', '9840599884', 'None', 'Osteoarthritis both knees')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED VITALS
INSERT INTO vitals (id, patient_id, systolic_bp, diastolic_bp, heart_rate, respiratory_rate, temperature, spo2, weight_kg, height_cm, bmi, blood_glucose, triage_priority, recorded_by) VALUES
('vit-1', 'pat-1', 138, 88, 76, 18, 98.4, 99, 74.5, 172.0, 25.2, 118, 'STANDARD', 'usr-rec-1'),
('vit-2', 'pat-2', 155, 95, 88, 20, 99.1, 97, 68.0, 158.0, 27.2, 164, 'URGENT', 'usr-rec-1'),
('vit-3', 'pat-3', 120, 78, 82, 22, 98.6, 95, 70.0, 178.0, 22.1, 95, 'STANDARD', 'usr-rec-1'),
('vit-4', 'pat-4', 124, 80, 74, 16, 98.2, 99, 58.0, 163.0, 21.8, 102, 'STANDARD', 'usr-rec-1'),
('vit-5', 'pat-5', 142, 86, 70, 18, 98.6, 98, 81.0, 169.0, 28.4, 130, 'STANDARD', 'usr-rec-1')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED TOKENS (Live Active Queue for Today)
INSERT INTO tokens (id, token_number, sequence_num, department_id, doctor_id, patient_id, vitals_id, status, triage_priority, queue_date, estimated_wait_mins, created_at) VALUES
('tok-1', 'CARD-101', 1, 'dept-cardio', 'doc-1', 'pat-1', 'vit-1', 'IN_CONSULTATION', 'STANDARD', CURRENT_DATE, 0, CURRENT_TIMESTAMP - INTERVAL '25 minutes'),
('tok-2', 'CARD-102', 2, 'dept-cardio', 'doc-1', 'pat-2', 'vit-2', 'CALLED', 'URGENT', CURRENT_DATE, 5, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
('tok-3', 'CARD-103', 3, 'dept-cardio', 'doc-1', 'pat-3', 'vit-3', 'WAITING', 'STANDARD', CURRENT_DATE, 15, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
('tok-4', 'CARD-104', 4, 'dept-cardio', 'doc-1', 'pat-4', 'vit-4', 'WAITING', 'STANDARD', CURRENT_DATE, 28, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
('tok-5', 'ORTH-201', 1, 'dept-ortho', 'doc-3', 'pat-5', 'vit-5', 'WAITING', 'STANDARD', CURRENT_DATE, 10, CURRENT_TIMESTAMP - INTERVAL '8 minutes')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED HISTORICAL PRESCRIPTIONS
INSERT INTO prescriptions (id, prescription_no, token_id, patient_id, doctor_id, department_id, diagnosis, clinical_notes, follow_up_date, advice) VALUES
('rx-1', 'RX-2026-0081', 'tok-1', 'pat-1', 'doc-1', 'dept-cardio', 'Essential Hypertension - Stage 1, Sinus Rhythm', 'Patient reports mild morning headaches. ECG shows normal sinus rhythm without ischemic changes. BP slightly elevated.', CURRENT_DATE + INTERVAL '30 days', 'Low sodium diet (<2g/day), 30 mins brisk walking daily, maintain blood pressure diary.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO prescription_medicines (id, prescription_id, medicine_name, dosage, frequency, duration_days, instructions) VALUES
('rxm-1', 'rx-1', 'Telmisartan Tablets IP', '40mg', '1-0-0 (Morning)', 30, 'After breakfast'),
('rxm-2', 'rx-1', 'Amlodipine Tablets IP', '5mg', '0-0-1 (Night)', 30, 'After dinner'),
('rxm-3', 'rx-1', 'Atorvastatin Tablets IP', '10mg', '0-0-1 (Night)', 30, 'Bedtime with water')
ON CONFLICT (id) DO NOTHING;
