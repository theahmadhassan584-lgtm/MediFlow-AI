import { useState, type FormEvent } from 'react';
import {
  X,
  Heart,
  Activity,
  FileText,
  AlertTriangle,
  Calendar,
  Sparkles,
  UserCheck,
  Thermometer,
  Wind,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import type { Patient, PatientStatus } from '../../types/index.ts';
import { useNavigate } from 'react-router-dom';

export const PatientDetailModal = () => {
  const { modal, closeModal, updatePatient, openModal } = useApp();
  const navigate = useNavigate();

  const patient = modal.data as Patient;

  const [activeTab, setActiveTab] = useState<'vitals' | 'notes' | 'contact'>('vitals');
  const [editingVitals, setEditingVitals] = useState(false);

  // Vitals edit state
  const [bp, setBp] = useState(patient?.vitals?.bloodPressure || '120/80 mmHg');
  const [hr, setHr] = useState(patient?.vitals?.heartRate || 72);
  const [spo2, setSpo2] = useState(patient?.vitals?.oxygenSaturation || 98);
  const [temp, setTemp] = useState(patient?.vitals?.temperature || 98.6);

  if (!patient) return null;

  const handleSaveVitals = (e: FormEvent) => {
    e.preventDefault();
    updatePatient(patient.id, {
      vitals: {
        bloodPressure: bp.includes('mmHg') ? bp : `${bp} mmHg`,
        heartRate: Number(hr),
        respiratoryRate: patient.vitals.respiratoryRate,
        temperature: Number(temp),
        oxygenSaturation: Number(spo2),
        recordedAt: 'Today, Just now',
      },
    });
    setEditingVitals(false);
  };

  const handleStatusChange = (newStatus: PatientStatus) => {
    updatePatient(patient.id, { status: newStatus });
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-container modal-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="patient-detail-title"
      >
        {/* Patient Banner Header */}
        <div className="patient-modal-header">
          <div className="patient-main-info">
            <div className="patient-modal-avatar">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>
            <div>
              <div className="patient-name-row">
                <h2 id="patient-detail-title">
                  {patient.firstName} {patient.lastName}
                </h2>
                <span className="patient-mrn-badge">{patient.mrn}</span>
                <span className={`status-badge ${patient.status.toLowerCase()}`}>
                  {patient.status}
                </span>
              </div>
              <div className="patient-submeta">
                <span>{patient.age} Years</span> • <span>{patient.gender}</span> •{' '}
                <span className="blood-badge">Blood: {patient.bloodGroup}</span> •{' '}
                <span>Dept: {patient.department}</span>
                {patient.roomNumber && <span> • Room: {patient.roomNumber}</span>}
              </div>
            </div>
          </div>

          <div className="patient-header-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                closeModal();
                openModal('bookAppointment', { patient });
              }}
            >
              <Calendar size={14} />
              Book Appointment
            </button>
            <button
              type="button"
              className="btn ai-quick-btn btn-sm"
              onClick={() => {
                closeModal();
                navigate('/ai-assistant');
              }}
            >
              <Sparkles size={14} />
              Analyze with AI
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status Selector & Navigation Tabs */}
        <div className="patient-modal-toolbar">
          <div className="modal-tabs">
            <button
              type="button"
              className={`modal-tab ${activeTab === 'vitals' ? 'active' : ''}`}
              onClick={() => setActiveTab('vitals')}
            >
              <Activity size={15} />
              Vitals & Health Overview
            </button>
            <button
              type="button"
              className={`modal-tab ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <FileText size={15} />
              SOAP Notes & History ({patient.medicalHistory.length})
            </button>
            <button
              type="button"
              className={`modal-tab ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <UserCheck size={15} />
              Demographics & Caregiver
            </button>
          </div>

          <div className="status-quick-switch">
            <span className="switch-label">Update Status:</span>
            <select
              value={patient.status}
              onChange={(e) => handleStatusChange(e.target.value as PatientStatus)}
              className="status-dropdown"
            >
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Critical">Critical</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
        </div>

        {/* Tab 1: Vitals & Health Overview */}
        {activeTab === 'vitals' && (
          <div className="modal-tab-content">
            <div className="vitals-header-row">
              <h4>Current Clinical Vitals</h4>
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={() => setEditingVitals(!editingVitals)}
              >
                {editingVitals ? 'Cancel' : 'Update Vitals'}
              </button>
            </div>

            {editingVitals ? (
              <form onSubmit={handleSaveVitals} className="vitals-edit-form">
                <div className="form-row-4">
                  <div className="form-group">
                    <label>Blood Pressure</label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={hr}
                      onChange={(e) => setHr(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>SpO2 (%)</label>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temp}
                      onChange={(e) => setTemp(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Updated Vitals
                  </button>
                </div>
              </form>
            ) : (
              <div className="vitals-grid">
                <div className="vital-card">
                  <div className="vital-icon-box blood-pressure">
                    <Heart size={20} />
                  </div>
                  <div className="vital-details">
                    <div className="vital-title">Blood Pressure</div>
                    <div className="vital-value">{patient.vitals.bloodPressure}</div>
                    <div className="vital-status normal">Target &lt; 130/80</div>
                  </div>
                </div>

                <div className="vital-card">
                  <div className="vital-icon-box heart-rate">
                    <Activity size={20} />
                  </div>
                  <div className="vital-details">
                    <div className="vital-title">Pulse / Heart Rate</div>
                    <div className="vital-value">{patient.vitals.heartRate} <small>bpm</small></div>
                    <div className="vital-status normal">Normal rhythm</div>
                  </div>
                </div>

                <div className="vital-card">
                  <div className="vital-icon-box oxygen">
                    <Wind size={20} />
                  </div>
                  <div className="vital-details">
                    <div className="vital-title">Oxygen Saturation (SpO2)</div>
                    <div className="vital-value">{patient.vitals.oxygenSaturation}%</div>
                    <div className="vital-status normal">Room air</div>
                  </div>
                </div>

                <div className="vital-card">
                  <div className="vital-icon-box temp">
                    <Thermometer size={20} />
                  </div>
                  <div className="vital-details">
                    <div className="vital-title">Body Temp</div>
                    <div className="vital-value">{patient.vitals.temperature}°F</div>
                    <div className="vital-status normal">Afebrile</div>
                  </div>
                </div>
              </div>
            )}

            <div className="vitals-timestamp">
              <Clock size={13} />
              <span>Last recorded: {patient.vitals.recordedAt} by Attending Clinical Staff</span>
            </div>

            {/* Medical Flags */}
            <div className="health-flags-grid">
              <div className="flag-panel allergies-panel">
                <div className="panel-title">
                  <AlertTriangle size={16} className="text-danger" />
                  <span>Documented Allergies</span>
                </div>
                <div className="chips-list">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((all, i) => (
                      <span key={i} className="chip chip-danger">
                        {all}
                      </span>
                    ))
                  ) : (
                    <span className="chip chip-neutral">No Known Drug Allergies</span>
                  )}
                </div>
              </div>

              <div className="flag-panel conditions-panel">
                <div className="panel-title">
                  <Heart size={16} className="text-primary" />
                  <span>Chronic & Pre-existing Conditions</span>
                </div>
                <div className="chips-list">
                  {patient.chronicConditions.length > 0 ? (
                    patient.chronicConditions.map((cond, i) => (
                      <span key={i} className="chip chip-info">
                        {cond}
                      </span>
                    ))
                  ) : (
                    <span className="chip chip-neutral">None documented</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SOAP Notes & Medical History */}
        {activeTab === 'notes' && (
          <div className="modal-tab-content">
            {patient.medicalHistory.length === 0 ? (
              <div className="empty-history-state">
                <FileText size={32} className="text-muted" />
                <p>No prior SOAP clinical encounters recorded yet.</p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    closeModal();
                    navigate('/ai-assistant');
                  }}
                >
                  <Sparkles size={14} />
                  Generate SOAP Note with MediFlow AI
                </button>
              </div>
            ) : (
              <div className="soap-records-list">
                {patient.medicalHistory.map((rec) => (
                  <div key={rec.id} className="soap-record-card">
                    <div className="soap-card-header">
                      <div>
                        <h5>{rec.diagnosis}</h5>
                        <div className="soap-card-meta">
                          <span>{rec.date}</span> • <span>{rec.doctorName}</span> •{' '}
                          <span>{rec.department}</span>
                        </div>
                      </div>
                      <span className="badge-pill">Verified EMR</span>
                    </div>

                    {rec.soapNotes && (
                      <div className="soap-breakdown-grid">
                        <div className="soap-block">
                          <span className="soap-label s">S - Subjective</span>
                          <p>{rec.soapNotes.subjective}</p>
                        </div>
                        <div className="soap-block">
                          <span className="soap-label o">O - Objective</span>
                          <p>{rec.soapNotes.objective}</p>
                        </div>
                        <div className="soap-block">
                          <span className="soap-label a">A - Assessment</span>
                          <p>{rec.soapNotes.assessment}</p>
                        </div>
                        <div className="soap-block">
                          <span className="soap-label p">P - Plan</span>
                          <p>{rec.soapNotes.plan}</p>
                        </div>
                      </div>
                    )}

                    {rec.prescriptions && rec.prescriptions.length > 0 && (
                      <div className="soap-prescriptions">
                        <span className="presc-label">Active Medications:</span>
                        <div className="presc-tags">
                          {rec.prescriptions.map((p, idx) => (
                            <span key={idx} className="presc-tag">
                              💊 {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Demographics & Contact */}
        {activeTab === 'contact' && (
          <div className="modal-tab-content">
            <div className="contact-details-grid">
              <div className="contact-card">
                <h5>Patient Contact Details</h5>
                <div className="contact-row">
                  <Phone size={15} />
                  <span>{patient.phone}</span>
                </div>
                <div className="contact-row">
                  <Mail size={15} />
                  <span>{patient.email}</span>
                </div>
                <div className="contact-row">
                  <MapPin size={15} />
                  <span>{patient.address}</span>
                </div>
                <div className="contact-row">
                  <Calendar size={15} />
                  <span>Admitted on: {patient.admissionDate}</span>
                </div>
              </div>

              <div className="contact-card">
                <h5>Emergency Caregiver / Relative</h5>
                <div className="contact-row">
                  <UserCheck size={15} />
                  <span>
                    <strong>{patient.emergencyContact.name}</strong> ({patient.emergencyContact.relation})
                  </span>
                </div>
                <div className="contact-row">
                  <Phone size={15} />
                  <span>{patient.emergencyContact.phone}</span>
                </div>
                <div className="emergency-notice">
                  Authorized to receive confidential medical updates under St. Jude HIPAA Release Form.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={closeModal}>
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};
