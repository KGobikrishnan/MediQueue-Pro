import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DEPARTMENTS } from '../../utils/constants';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Stethoscope,
  Key,
  Mail,
  Phone,
  Shield,
  Clock,
  Building,
  Search,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';

export const DoctorManagement = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useQueue();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');

  // Modals state
  const [modalMode, setModalMode] = useState(null); // 'ADD' | 'EDIT' | 'DELETE_CONFIRM' | null
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    doctorId: '',
    email: '',
    password: '',
    qualification: '',
    department: 'cardiology',
    roomNo: 'Room 201',
    phone: '',
    experience: '5+ Years',
    avgConsultTimeMin: 12,
    status: 'AVAILABLE'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const openAddModal = () => {
    const generatedDocId = `DOC-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      name: '',
      doctorId: generatedDocId,
      email: '',
      password: `Doc@${Math.floor(1000 + Math.random() * 9000)}`,
      qualification: 'MBBS, MD',
      department: 'cardiology',
      roomNo: 'Room 201',
      phone: '+91 98400 00000',
      experience: '5+ Years',
      avgConsultTimeMin: 12,
      status: 'AVAILABLE'
    });
    setModalMode('ADD');
  };

  const openEditModal = (doc) => {
    setSelectedDoctor(doc);
    setFormData({
      name: doc.name,
      doctorId: doc.doctorId || doc.id?.toUpperCase() || 'DOC-1001',
      email: doc.email || `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@mediqueue.pro`,
      password: doc.password || 'Doctor@123',
      qualification: doc.qualification || 'MBBS, MD',
      department: doc.department || 'cardiology',
      roomNo: doc.roomNo || 'Room 101',
      phone: doc.phone || '+91 98401 12345',
      experience: doc.experience || '8+ Years',
      avgConsultTimeMin: doc.avgConsultTimeMin || 12,
      status: doc.status || 'AVAILABLE'
    });
    setModalMode('EDIT');
  };

  const openDeleteModal = (doc) => {
    setSelectedDoctor(doc);
    setModalMode('DELETE_CONFIRM');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedDoctor(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const deptObj = DEPARTMENTS.find((d) => d.id === formData.department);
    const payload = {
      ...formData,
      deptName: deptObj?.name || 'General Medicine'
    };

    if (modalMode === 'ADD') {
      addDoctor(payload);
      triggerToast(`Doctor ${formData.name} added with Login ID: ${formData.doctorId}`);
    } else if (modalMode === 'EDIT' && selectedDoctor) {
      updateDoctor(selectedDoctor.id, payload);
      triggerToast(`Doctor profile for ${formData.name} updated successfully!`);
    }
    closeModal();
  };

  const handleDeleteConfirm = () => {
    if (selectedDoctor) {
      deleteDoctor(selectedDoctor.id);
      triggerToast(`Doctor ${selectedDoctor.name} removed from roster`);
      closeModal();
    }
  };

  // Filtered doctors list
  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = filterDept === 'ALL' || doc.department === filterDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(q) ||
      (doc.deptName && doc.deptName.toLowerCase().includes(q)) ||
      (doc.roomNo && doc.roomNo.toLowerCase().includes(q)) ||
      (doc.doctorId && doc.doctorId.toLowerCase().includes(q)) ||
      (doc.email && doc.email.toLowerCase().includes(q));
    return matchesDept && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0f172a',
          color: '#38bdf8',
          border: '1px solid #0284c7',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 99999,
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={20} color="#22c55e" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0b4175 0%, #025cb0 100%)',
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
            <Stethoscope size={36} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                Doctor Roster & Credential Management
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
                {doctors.length} Active Consultants
              </span>
            </div>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.88rem', color: '#e0f2fe' }}>
              Add, edit, delete clinical specialists, assign OPD rooms, and manage doctor authentication credentials (Doctor ID & Password).
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          style={{
            background: '#ffffff',
            color: '#0b4175',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.8rem 1.5rem',
            fontWeight: 800,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'transform 120ms ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={20} color="#025cb0" />
          <span>+ Add New Doctor</span>
        </button>
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
        <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Doctor Name, ID, Speciality, or Room..."
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
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Department:</span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              background: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            <option value="ALL">All Departments ({doctors.length})</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {filteredDoctors.map((doc) => {
          const docCode = doc.doctorId || doc.id?.toUpperCase() || 'DOC-1001';
          const docMail = doc.email || `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@mediqueue.pro`;
          const docPass = doc.password || 'Doctor@123';

          return (
            <div
              key={doc.id}
              className="interactive-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}
            >
              <div>
                {/* Top Row: Avatar, Name & Status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={doc.photoUrl || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200`}
                        alt={doc.name}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: 'var(--radius-md)',
                          objectFit: 'cover',
                          border: '2px solid var(--brand-primary)'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-4px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        border: '2px solid #ffffff'
                      }} />
                    </div>

                    <div>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {doc.name}
                      </h2>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '0.1rem' }}>
                        {doc.deptName || doc.department?.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {doc.qualification}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    background: doc.status === 'AVAILABLE' ? '#dcfce7' : '#f1f5f9',
                    color: doc.status === 'AVAILABLE' ? '#15803d' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px'
                  }}>
                    {doc.status || 'ACTIVE OPD'}
                  </span>
                </div>

                {/* Key Doctor Details Strip */}
                <div style={{
                  background: 'var(--surface-02)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 0.9rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.6rem',
                  fontSize: '0.8rem',
                  marginBottom: '0.85rem',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>OPD CONSULTING ROOM</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{doc.roomNo || 'Room 101'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>AVG CONSULT TIME</span>
                    <strong style={{ color: 'var(--brand-primary)' }}>{doc.avgConsultTimeMin || 12} mins / patient</strong>
                  </div>
                </div>

                {/* Doctor ID & Auth Credentials Badge (MNC Requirement) */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  border: '1px solid #bae6fd',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, color: '#0369a1' }}>
                      <Key size={14} />
                      <span>Doctor Login ID:</span>
                      <span style={{ fontFamily: 'var(--font-data)', background: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                        {docCode}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0369a1', fontWeight: 600 }}>
                      <Lock size={13} />
                      <span>Pass:</span>
                      <span style={{ fontFamily: 'var(--font-data)', background: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                        {docPass}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0c4a6e', fontSize: '0.72rem' }}>
                    <Mail size={12} />
                    <span>{docMail}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Consultations Today: <strong style={{ color: 'var(--text-primary)' }}>{doc.todayConsulted || 0}</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openEditModal(doc)}
                    style={{
                      background: 'var(--brand-light)',
                      color: 'var(--brand-primary)',
                      border: '1px solid var(--border-active)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={14} />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => openDeleteModal(doc)}
                    style={{
                      background: 'var(--triage-emergency-bg)',
                      color: 'var(--triage-emergency)',
                      border: '1px solid var(--triage-emergency-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDoctors.length === 0 && (
        <div style={{
          background: 'var(--surface-01)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <Stethoscope size={44} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>No Doctors Found</h3>
          <p style={{ fontSize: '0.85rem' }}>Try clearing your search query or filter.</p>
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      {(modalMode === 'ADD' || modalMode === 'EDIT') && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div style={{
            background: 'var(--surface-01)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-raised)',
            border: '1px solid var(--border-subtle)',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)'
              }}>
                <Stethoscope size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {modalMode === 'ADD' ? 'Add New Consultant Doctor' : `Edit Doctor Profile: ${formData.name}`}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Configure clinical specialization, room assignment, and doctor login credentials.
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Row 1: Name & Doctor ID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Doctor Full Name (with Title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sundaram"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Doctor Login ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DOC-408"
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-data)', fontWeight: 700, color: 'var(--brand-primary)' }}
                  />
                </div>
              </div>

              {/* Row 2: Email & Password (Login Credentials) */}
              <div style={{
                background: 'var(--surface-02)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '1rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-dark)', marginBottom: '0.3rem' }}>
                    Doctor Email ID (Username) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="dr.rajesh@mediqueue.pro"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: '#ffffff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-dark)', marginBottom: '0.3rem' }}>
                    Doctor Password (Secret) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Doctor@123"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 2.2rem 0.6rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: '#ffffff', fontSize: '0.85rem', fontFamily: 'var(--font-data)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Speciality & Room */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Department Speciality *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: '#ffffff', fontSize: '0.9rem', fontWeight: 600 }}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.floor})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Allocated OPD Room *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 204"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', fontSize: '0.9rem', fontWeight: 600 }}
                  />
                </div>
              </div>

              {/* Row 4: Qualification & Experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Medical Qualification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD, DM (Cardiology), FACC"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Avg Consult Time
                  </label>
                  <select
                    value={formData.avgConsultTimeMin}
                    onChange={(e) => setFormData({ ...formData, avgConsultTimeMin: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: '#ffffff', fontSize: '0.9rem' }}
                  >
                    <option value={8}>8 Minutes (Fast OPD)</option>
                    <option value={12}>12 Minutes (Standard)</option>
                    <option value={15}>15 Minutes (Detailed)</option>
                    <option value={20}>20 Minutes (Super Speciality)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Status */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Roster Availability Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: '#ffffff', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  <option value="AVAILABLE">AVAILABLE (Accepting OPD Tokens)</option>
                  <option value="ON_LEAVE">ON LEAVE / OFF DUTY</option>
                  <option value="ON_CALL">ON EMERGENCY CALL</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'var(--brand-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  {modalMode === 'ADD' ? 'Save Doctor & Issue Credentials' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: 'var(--surface-02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'DELETE_CONFIRM' && selectedDoctor && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div style={{
            background: 'var(--surface-01)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '440px',
            boxShadow: 'var(--shadow-raised)',
            border: '1px solid var(--border-subtle)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--triage-emergency-bg)',
              color: 'var(--triage-emergency)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Remove Doctor from OPD Roster?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong>{selectedDoctor.name}</strong> ({selectedDoctor.deptName || selectedDoctor.department})? This doctor will no longer be available for appointment bookings.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  flex: 1,
                  background: 'var(--triage-emergency)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.8rem',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Yes, Delete Doctor
              </button>

              <button
                onClick={closeModal}
                style={{
                  flex: 1,
                  background: 'var(--surface-02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
