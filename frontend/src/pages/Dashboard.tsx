import {
  Users,
  CalendarCheck,
  Stethoscope,
  Activity,
  AlertTriangle,
  UserPlus,
  CalendarPlus,
  Sparkles,
  ArrowUpRight,
  Clock,
  Heart,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const {
    patients,
    doctors,
    appointments,
    departmentStats,
    openModal,
    updateAppointmentStatus,
  } = useApp();

  const navigate = useNavigate();

  // Summary Metrics
  const totalPatients = patients.length;
  const inpatientCount = patients.filter((p) => p.status === 'Inpatient').length;
  const criticalCount = patients.filter((p) => p.status === 'Critical').length;

  const todayAppointments = appointments.filter(
    (a) => a.date === '2026-10-15' || a.status === 'In-Queue' || a.status === 'Confirmed'
  );

  const activeDoctors = doctors.filter((d) => d.status === 'Available');
  const inSurgeryDoctors = doctors.filter((d) => d.status === 'In Surgery');

  const avgOccupancy = Math.round(
    departmentStats.reduce((acc, curr) => acc + curr.bedOccupancyPercent, 0) /
      departmentStats.length
  );

  return (
    <div className="page-dashboard">
      {/* Welcome Banner */}
      <div className="dashboard-hero-banner">
        <div className="hero-text-content">
          <div className="hero-badge">
            <span className="pulse-dot" />
            <span>Hospital Operations Live • Day Shift Active</span>
          </div>
          <h2>Welcome back, Dr. Sarah Mitchell</h2>
          <p className="hero-subtext">
            St. Jude Medical Center clinical dashboard. Today is Wednesday, October 15, 2026.
            There are <strong>{criticalCount} critical patients</strong> requiring active surveillance.
          </p>
        </div>

        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-white-pill"
            onClick={() => openModal('newPatient')}
          >
            <UserPlus size={16} />
            <span>Admit Patient</span>
          </button>
          <button
            type="button"
            className="btn btn-white-pill"
            onClick={() => openModal('bookAppointment')}
          >
            <CalendarPlus size={16} />
            <span>Book Visit</span>
          </button>
          <button
            type="button"
            className="btn btn-ai-hero"
            onClick={() => navigate('/ai-assistant')}
          >
            <Sparkles size={16} />
            <span>Consult AI Copilot</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="stats-kpi-grid">
        {/* Card 1: Patients */}
        <div className="kpi-card" onClick={() => navigate('/patients')}>
          <div className="kpi-header">
            <div className="kpi-icon-box blue">
              <Users size={22} />
            </div>
            <span className="trend-badge positive">
              <ArrowUpRight size={14} /> +8.4%
            </span>
          </div>
          <div className="kpi-value">{totalPatients}</div>
          <div className="kpi-label">Active Registered Patients</div>
          <div className="kpi-subtext">
            <span>{inpatientCount} Inpatients</span> •{' '}
            <strong className="text-danger">{criticalCount} Critical (ICU)</strong>
          </div>
        </div>

        {/* Card 2: Today's Appointments */}
        <div className="kpi-card" onClick={() => navigate('/appointments')}>
          <div className="kpi-header">
            <div className="kpi-icon-box teal">
              <CalendarCheck size={22} />
            </div>
            <span className="kpi-pill-today">Today</span>
          </div>
          <div className="kpi-value">{todayAppointments.length}</div>
          <div className="kpi-label">Today&apos;s Appointments</div>
          <div className="kpi-subtext">
            <span>{todayAppointments.filter((a) => a.status === 'In-Queue').length} In Waiting Queue</span> •{' '}
            <span>{todayAppointments.filter((a) => a.status === 'Confirmed').length} Confirmed</span>
          </div>
        </div>

        {/* Card 3: Doctors on Duty */}
        <div className="kpi-card" onClick={() => navigate('/doctors')}>
          <div className="kpi-header">
            <div className="kpi-icon-box indigo">
              <Stethoscope size={22} />
            </div>
            <span className="kpi-status-live">On Duty</span>
          </div>
          <div className="kpi-value">{activeDoctors.length} / {doctors.length}</div>
          <div className="kpi-label">Specialist Providers Active</div>
          <div className="kpi-subtext">
            <span>{inSurgeryDoctors.length} in OR / Surgery</span> •{' '}
            <span>{activeDoctors.length} available for consult</span>
          </div>
        </div>

        {/* Card 4: Clinical Bed Occupancy */}
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-box orange">
              <Activity size={22} />
            </div>
            <span className="trend-badge neutral">Stable</span>
          </div>
          <div className="kpi-value">{avgOccupancy}%</div>
          <div className="kpi-label">Overall Bed Occupancy</div>
          <div className="kpi-subtext">
            <span>Cardiology: 88%</span> • <span>Neuro ICU: 92%</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Two-Column Grid */}
      <div className="dashboard-content-grid">
        {/* Left Column: Today's Appointments Queue & Triage */}
        <div className="dashboard-main-col">
          {/* Today's Appointments Table Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title-group">
                <h3>Today&apos;s Clinical Queue</h3>
                <span className="dash-card-badge">{todayAppointments.length} Consultations</span>
              </div>
              <button
                type="button"
                className="btn-link"
                onClick={() => navigate('/appointments')}
              >
                <span>View Full Schedule</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="table-responsive">
              <table className="med-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient Name & MRN</th>
                    <th>Provider</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.slice(0, 5).map((apt) => (
                    <tr key={apt.id}>
                      <td className="cell-time">
                        <Clock size={13} className="time-icon" />
                        <span>{apt.time}</span>
                      </td>
                      <td>
                        <div className="table-patient-name">{apt.patientName}</div>
                        <div className="table-patient-sub">{apt.patientMrn}</div>
                      </td>
                      <td>
                        <div className="table-doc-name">{apt.doctorName}</div>
                        <div className="table-doc-sub">{apt.department}</div>
                      </td>
                      <td>
                        <span className="type-tag">{apt.type}</span>
                      </td>
                      <td>
                        <span className={`priority-tag ${apt.priority.toLowerCase()}`}>
                          {apt.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${apt.status.toLowerCase().replace(' ', '-')}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-action-btns">
                          {apt.status === 'Confirmed' && (
                            <button
                              type="button"
                              className="btn btn-outline btn-xs"
                              onClick={() => updateAppointmentStatus(apt.id, 'In-Queue')}
                              title="Check-in patient"
                            >
                              Check In
                            </button>
                          )}
                          {apt.status === 'In-Queue' && (
                            <button
                              type="button"
                              className="btn btn-primary btn-xs"
                              onClick={() => updateAppointmentStatus(apt.id, 'In-Consultation')}
                              title="Start consultation"
                            >
                              Consult
                            </button>
                          )}
                          {apt.status === 'In-Consultation' && (
                            <button
                              type="button"
                              className="btn btn-success btn-xs"
                              onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                              title="Complete consultation"
                            >
                              <CheckCircle2 size={13} />
                              Complete
                            </button>
                          )}
                          {apt.status === 'Completed' && (
                            <span className="text-muted text-xs">Completed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Patients & Triage Surveillance */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title-group">
                <ShieldAlert size={18} className="text-danger" />
                <h3>High-Risk Patients & Triage Watchlist</h3>
              </div>
              <button
                type="button"
                className="btn-link"
                onClick={() => navigate('/patients')}
              >
                <span>All Patients</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="triage-cards-list">
              {patients
                .filter((p) => p.status === 'Critical' || p.department === 'Cardiology')
                .slice(0, 3)
                .map((patient) => (
                  <div
                    key={patient.id}
                    className="triage-item-card"
                    onClick={() => openModal('patientDetail', patient)}
                  >
                    <div className="triage-item-top">
                      <div className="triage-patient-info">
                        <div className="triage-avatar">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </div>
                        <div>
                          <div className="triage-name">
                            {patient.firstName} {patient.lastName}
                            <span className="mrn-tag">{patient.mrn}</span>
                          </div>
                          <div className="triage-meta">
                            {patient.age} yrs • {patient.gender} • {patient.department}
                            {patient.roomNumber && ` • ${patient.roomNumber}`}
                          </div>
                        </div>
                      </div>

                      <span className={`status-badge ${patient.status.toLowerCase()}`}>
                        {patient.status}
                      </span>
                    </div>

                    <div className="triage-vitals-strip">
                      <div className="triage-vital-pill">
                        <Heart size={13} className="text-danger" />
                        <span>BP: <strong>{patient.vitals.bloodPressure}</strong></span>
                      </div>
                      <div className="triage-vital-pill">
                        <Activity size={13} className="text-primary" />
                        <span>HR: <strong>{patient.vitals.heartRate} bpm</strong></span>
                      </div>
                      <div className="triage-vital-pill">
                        <span>SpO2: <strong>{patient.vitals.oxygenSaturation}%</strong></span>
                      </div>
                      <div className="triage-vital-pill">
                        <span>Temp: <strong>{patient.vitals.temperature}°F</strong></span>
                      </div>
                    </div>

                    {patient.allergies.length > 0 && (
                      <div className="triage-allergies-bar">
                        <AlertTriangle size={13} className="text-warning" />
                        <span>Allergies: {patient.allergies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Teaser & Department Occupancy */}
        <div className="dashboard-side-col">
          {/* MediFlow AI Copilot Widget */}
          <div className="ai-widget-card">
            <div className="ai-widget-header">
              <div className="ai-widget-title">
                <Sparkles size={18} className="ai-glow-icon" />
                <span>MediFlow AI Clinical Copilot</span>
              </div>
              <span className="ai-status-pill">Active</span>
            </div>

            <p className="ai-widget-description">
              Diagnostic decision support, rapid SOAP notes synthesis, and automated pharmacovigilance screening.
            </p>

            <div className="ai-quick-prompts">
              <button
                type="button"
                className="ai-prompt-btn"
                onClick={() => navigate('/ai-assistant')}
              >
                📝 Generate SOAP clinical encounter note
              </button>
              <button
                type="button"
                className="ai-prompt-btn"
                onClick={() => navigate('/ai-assistant')}
              >
                ⚠️ Check drug interactions (Metoprolol + Aspirin)
              </button>
              <button
                type="button"
                className="ai-prompt-btn"
                onClick={() => navigate('/ai-assistant')}
              >
                👶 Pediatric weight-based dosage calculator
              </button>
            </div>

            <button
              type="button"
              className="btn btn-ai-full"
              onClick={() => navigate('/ai-assistant')}
            >
              <Sparkles size={16} />
              Open AI Clinical Workspace
            </button>
          </div>

          {/* Department Capacity & Occupancy */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Department Bed Occupancy</h3>
              <span className="text-muted text-xs">Live census</span>
            </div>

            <div className="dept-occupancy-list">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="dept-stat-item">
                  <div className="dept-stat-header">
                    <span className="dept-name">{dept.name}</span>
                    <span className="dept-percent">{dept.bedOccupancyPercent}%</span>
                  </div>
                  <div className="dept-progress-track">
                    <div
                      className={`dept-progress-fill ${
                        dept.bedOccupancyPercent > 85 ? 'high' : 'normal'
                      }`}
                      style={{ width: `${dept.bedOccupancyPercent}%` }}
                    />
                  </div>
                  <div className="dept-stat-footer">
                    <span>{dept.doctorsOnDuty} Doctors on duty</span>
                    <span>~{dept.avgWaitTimeMinutes}m wait</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Protocols Quick Card */}
          <div className="emergency-quick-card">
            <div className="emergency-header">
              <ShieldAlert size={20} />
              <div>
                <h4>Emergency Response Codes</h4>
                <p>Hospital Rapid Response Dispatch</p>
              </div>
            </div>
            <div className="emergency-buttons-row">
              <button type="button" className="btn-emergency code-blue">
                Code Blue (Arrest)
              </button>
              <button type="button" className="btn-emergency code-stroke">
                Code Stroke (STAT)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
