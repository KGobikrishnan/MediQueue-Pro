import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DEPARTMENTS } from '../../utils/constants';
import { Users, Plus, Edit2, Trash2, CheckCircle2, Stethoscope } from 'lucide-react';

export const DoctorManagement = () => {
  const { doctors } = useQueue();
  const [docList, setDocList] = useState(doctors);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newDept, setNewDept] = useState('cardiology');
  const [newRoom, setNewRoom] = useState('Room 302');

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const deptObj = DEPARTMENTS.find((d) => d.id === newDept);
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: newName,
      qualification: newQualification || 'MBBS, MD',
      department: newDept,
      deptName: deptObj?.name || 'General Medicine',
      roomNo: newRoom,
      status: 'AVAILABLE',
      avgConsultTimeMin: 12,
      todayConsulted: 0
    };
    setDocList([...docList, newDoc]);
    setShowAddModal(false);
    setNewName('');
    setNewQualification('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1050px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            OPD Doctor Roster & Room Allocation
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Manage consultant doctors, speciality departments, OPD rooms, and active status
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'var(--primary-600)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1.3rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={18} />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Add Consultant Doctor
            </h2>

            <form onSubmit={handleAddDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Doctor Full Name (with Title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Gupta"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Medical Qualifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (General Medicine)"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Department
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: '#fff' }}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Allocated Room
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 205"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'var(--primary-600)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  Save Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1.25rem',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {docList.map((doc) => (
          <div
            key={doc.id}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'var(--primary-50)',
                color: 'var(--primary-700)',
                padding: '0.75rem',
                borderRadius: '50%',
                display: 'flex'
              }}>
                <Stethoscope size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {doc.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                  {doc.deptName || doc.department?.toUpperCase()} • {doc.qualification}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Room: <strong>{doc.roomNo}</strong> • Avg Consult: {doc.avgConsultTimeMin || 12} mins
                </div>
              </div>
            </div>

            <span style={{
              background: '#dcfce7',
              color: '#15803d',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}>
              ACTIVE OPD
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
