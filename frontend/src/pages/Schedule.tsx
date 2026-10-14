import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Schedule = () => {
  const { doctors, appointments, openModal } = useApp();

  const [currentDate] = useState('2026-10-15');
  const [selectedDept, setSelectedDept] = useState('All');

  const timeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const filteredDoctors = doctors.filter(
    (d) => selectedDept === 'All' || d.department === selectedDept
  );

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
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Master Clinical Schedule & Room Allocations</h2>
          <p className="page-subtitle">
            Visual room and provider availability grid, consultation slot booking, and shift timelines
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal('bookAppointment', { defaultDate: currentDate })}
        >
          <Plus size={16} />
          <span>New Appointment Slot</span>
        </button>
      </div>

      {/* Date Navigation & Filters */}
      <div className="toolbar-card">
        <div className="schedule-date-nav">
          <button type="button" className="btn-icon" aria-label="Previous day">
            <ChevronLeft size={18} />
          </button>
          <div className="schedule-date-display">
            <CalendarIcon size={18} className="text-primary" />
            <span className="current-date-title">Wednesday, October 15, 2026</span>
            <span className="current-date-badge">Today</span>
          </div>
          <button type="button" className="btn-icon" aria-label="Next day">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="toolbar-filters">
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
        </div>
      </div>

      {/* Schedule Main Content */}
      <div className="schedule-layout-grid">
        {/* Left Column: Visual Timeline Grid */}
        <div className="timeline-grid-card">
          <div className="timeline-grid-header">
            <h4>Consultation Slots & Room Occupancy</h4>
            <span className="text-muted text-xs">Click any empty slot to schedule</span>
          </div>

          <div className="timeline-slots-container">
            {timeSlots.map((time) => {
              // Appointments in this hour slot
              const slotAppointments = appointments.filter((a) => {
                const hourPrefix = time.split(':')[0];
                const aptHour = a.time.split(':')[0];
                const matchesDept = selectedDept === 'All' || a.department === selectedDept;
                return a.date === currentDate && aptHour === hourPrefix && matchesDept;
              });

              return (
                <div key={time} className="timeline-slot-row">
                  <div className="time-marker">
                    <Clock size={13} className="time-marker-icon" />
                    <span>{time}</span>
                  </div>

                  <div className="slot-content-area">
                    {slotAppointments.length === 0 ? (
                      <div
                        className="empty-slot-placeholder"
                        onClick={() =>
                          openModal('bookAppointment', {
                            defaultDate: currentDate,
                            defaultTime: time,
                          })
                        }
                      >
                        <Plus size={14} />
                        <span>Available Slot — Click to schedule</span>
                      </div>
                    ) : (
                      <div className="slot-appointments-list">
                        {slotAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`timeline-appointment-card ${apt.priority.toLowerCase()}`}
                          >
                            <div className="apt-top-row">
                              <span className="apt-patient-bold">
                                {apt.patientName} ({apt.patientMrn})
                              </span>
                              <span
                                className={`status-pill xs ${apt.status
                                  .toLowerCase()
                                  .replace(' ', '-')}`}
                              >
                                {apt.status}
                              </span>
                            </div>

                            <div className="apt-sub-row">
                              <span>
                                Provider: <strong>{apt.doctorName}</strong>
                              </span>
                              <span>• {apt.department}</span>
                              {apt.roomNumber && <span>• {apt.roomNumber}</span>}
                              <span>• {apt.time} ({apt.durationMinutes}m)</span>
                            </div>

                            {apt.notes && <p className="apt-notes-preview">{apt.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Specialists on Duty */}
        <div className="schedule-side-panel">
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Physicians on Duty Today</h3>
              <span className="badge-pill">{filteredDoctors.length} Active</span>
            </div>

            <div className="duty-doctors-list">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="duty-doctor-item"
                  onClick={() => openModal('doctorDetail', doc)}
                >
                  <img src={doc.avatarUrl} alt={doc.name} className="duty-doctor-avatar" />
                  <div className="duty-doctor-info">
                    <div className="duty-doctor-name">{doc.name}</div>
                    <div className="duty-doctor-sub">
                      {doc.specialty} • {doc.roomNumber}
                    </div>
                    <div className="duty-doctor-hours">{doc.consultingHours}</div>
                  </div>
                  <span
                    className={`status-badge xs ${doc.status
                      .toLowerCase()
                      .replace(' ', '-')}`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Schedule Notice */}
          <div className="schedule-info-notice">
            <CheckCircle2 size={18} className="text-success" />
            <div>
              <h5>OR & Cath Lab Clearance</h5>
              <p>
                Surgical suites 2 &amp; 3 operational. Emergency standby surgeon: Dr. Claire Laurent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
