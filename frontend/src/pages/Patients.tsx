import { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Heart,
  Activity,
  Calendar,
  Eye,
  Trash2,
  LayoutGrid,
  List,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import type { PatientStatus } from '../types/index.ts';

export const Patients = () => {
  const { patients, openModal, deletePatient } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | PatientStatus>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.allergies.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.chronicConditions.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'All' || p.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = [
    'All',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Oncology',
    'General Medicine',
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Patient Registry & EMR Management</h2>
          <p className="page-subtitle">
            Centralized health records, clinical vitals surveillance, and patient admissions
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal('newPatient')}
        >
          <UserPlus size={16} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="toolbar-card">
        <div className="toolbar-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by Patient name, MRN, phone, allergies, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          {/* Department Filter */}
          <div className="filter-dropdown-wrapper">
            <Filter size={15} />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="toolbar-select"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="segmented-control">
            {(['All', 'Inpatient', 'Outpatient', 'Critical', 'Discharged'] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  className={`segment-btn ${selectedStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              title="Table view"
            >
              <List size={18} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid card view"
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="results-meta-bar">
        <span>
          Showing <strong>{filteredPatients.length}</strong> of {patients.length} total patients
        </span>
      </div>

      {/* View 1: Table View */}
      {viewMode === 'table' && (
        <div className="table-card">
          <div className="table-responsive">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Patient Info & MRN</th>
                  <th>Demographics</th>
                  <th>Department & Room</th>
                  <th>Attending Physician</th>
                  <th>Latest Vitals</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <Users size={32} className="text-muted mb-2" />
                      <p>No matching patient records found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="clickable-row"
                      onClick={() => openModal('patientDetail', patient)}
                    >
                      <td>
                        <div className="patient-cell">
                          <div className="patient-mini-avatar">
                            {patient.firstName[0]}
                            {patient.lastName[0]}
                          </div>
                          <div>
                            <div className="table-patient-name">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="table-patient-sub">
                              <span className="mrn-badge-sm">{patient.mrn}</span>
                              <span>• {patient.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {patient.age} yrs • {patient.gender}
                        </div>
                        <span className="blood-badge-sm">Blood: {patient.bloodGroup}</span>
                      </td>
                      <td>
                        <div className="dept-cell-name">{patient.department}</div>
                        <div className="room-cell-sub">
                          {patient.roomNumber ? patient.roomNumber : 'Outpatient Intake'}
                        </div>
                      </td>
                      <td>
                        <div className="doc-cell-name">{patient.primaryDoctorName}</div>
                      </td>
                      <td>
                        <div className="vitals-micro-strip">
                          <span title="Blood Pressure">BP: {patient.vitals.bloodPressure}</span>
                          <span title="Heart Rate">HR: {patient.vitals.heartRate} bpm</span>
                          <span title="SpO2">SpO2: {patient.vitals.oxygenSaturation}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge sm ${patient.status.toLowerCase()}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td>
                        <div
                          className="table-action-btns"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => openModal('patientDetail', patient)}
                            title="View Patient Record"
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-xs"
                            onClick={() => openModal('bookAppointment', { patient })}
                            title="Book Appointment"
                          >
                            <Calendar size={13} />
                            <span>Book</span>
                          </button>
                          <button
                            type="button"
                            className="btn-icon-danger btn-xs"
                            onClick={() => {
                              if (confirm(`Remove record for ${patient.firstName} ${patient.lastName}?`)) {
                                deletePatient(patient.id);
                              }
                            }}
                            title="Delete Patient Record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Grid View */}
      {viewMode === 'grid' && (
        <div className="patient-cards-grid">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="patient-summary-card"
              onClick={() => openModal('patientDetail', patient)}
            >
              <div className="patient-card-header">
                <div className="patient-card-avatar">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </div>
                <div className="patient-card-meta">
                  <h4>
                    {patient.firstName} {patient.lastName}
                  </h4>
                  <span className="mrn-badge-sm">{patient.mrn}</span>
                </div>
                <span className={`status-badge sm ${patient.status.toLowerCase()}`}>
                  {patient.status}
                </span>
              </div>

              <div className="patient-card-body">
                <div className="patient-info-row">
                  <span>Demographics:</span>
                  <strong>
                    {patient.age} yrs • {patient.gender} • {patient.bloodGroup}
                  </strong>
                </div>

                <div className="patient-info-row">
                  <span>Department:</span>
                  <strong>{patient.department}</strong>
                </div>

                {patient.roomNumber && (
                  <div className="patient-info-row">
                    <span>Room / Bed:</span>
                    <strong>{patient.roomNumber}</strong>
                  </div>
                )}

                <div className="patient-info-row">
                  <span>Physician:</span>
                  <strong>{patient.primaryDoctorName}</strong>
                </div>

                {/* Vitals Box */}
                <div className="card-vitals-box">
                  <div className="mini-vital">
                    <Heart size={13} className="text-danger" />
                    <span>{patient.vitals.bloodPressure}</span>
                  </div>
                  <div className="mini-vital">
                    <Activity size={13} className="text-primary" />
                    <span>{patient.vitals.heartRate} bpm</span>
                  </div>
                  <div className="mini-vital">
                    <span>{patient.vitals.oxygenSaturation}% SpO2</span>
                  </div>
                </div>

                {patient.allergies.length > 0 && (
                  <div className="patient-allergies-chip-row">
                    <AlertTriangle size={13} className="text-danger" />
                    <span className="allergy-text">{patient.allergies.join(', ')}</span>
                  </div>
                )}
              </div>

              <div
                className="patient-card-footer"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => openModal('patientDetail', patient)}
                >
                  <Eye size={14} />
                  View Clinical EMR
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openModal('bookAppointment', { patient })}
                  title="Schedule Appointment"
                >
                  <Calendar size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
