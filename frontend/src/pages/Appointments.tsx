import { useState } from 'react';
import {
  CalendarCheck,
  Search,
  CalendarPlus,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import type { AppointmentStatus } from '../types/index.ts';

export const Appointments = () => {
  const {
    appointments,
    openModal,
    updateAppointmentStatus,
    cancelAppointment,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | AppointmentStatus>('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'upcoming'>('all');

  // Stats
  const todayApts = appointments.filter((a) => a.date === '2026-10-15');
  const inQueueCount = appointments.filter((a) => a.status === 'In-Queue').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const urgentCount = appointments.filter(
    (a) => a.priority === 'Urgent' || a.priority === 'Emergency'
  ).length;

  // Filtering
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientMrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.notes && apt.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || apt.status === selectedStatus;
    const matchesDept = selectedDept === 'All' || apt.department === selectedDept;

    let matchesDate = true;
    if (dateRange === 'today') {
      matchesDate = apt.date === '2026-10-15';
    } else if (dateRange === 'upcoming') {
      matchesDate = apt.date >= '2026-10-15';
    }

    return matchesSearch && matchesStatus && matchesDept && matchesDate;
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
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Clinical Appointments & Scheduling</h2>
          <p className="page-subtitle">
            Manage provider appointments, triage waiting room queues, and consultation status
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal('bookAppointment')}
        >
          <CalendarPlus size={16} />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Appointment KPI Summary Cards */}
      <div className="appointments-stats-row">
        <div className="apt-stat-card">
          <div className="apt-stat-icon-box blue">
            <CalendarCheck size={20} />
          </div>
          <div>
            <div className="apt-stat-val">{todayApts.length}</div>
            <div className="apt-stat-lbl">Scheduled Today</div>
          </div>
        </div>

        <div className="apt-stat-card">
          <div className="apt-stat-icon-box orange">
            <Clock size={20} />
          </div>
          <div>
            <div className="apt-stat-val">{inQueueCount}</div>
            <div className="apt-stat-lbl">In Waiting Queue</div>
          </div>
        </div>

        <div className="apt-stat-card">
          <div className="apt-stat-icon-box green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="apt-stat-val">{completedCount}</div>
            <div className="apt-stat-lbl">Completed Today</div>
          </div>
        </div>

        <div className="apt-stat-card">
          <div className="apt-stat-icon-box red">
            <Clock size={20} />
          </div>
          <div>
            <div className="apt-stat-val">{urgentCount}</div>
            <div className="apt-stat-lbl">Urgent / Emergency Priority</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="toolbar-card">
        <div className="toolbar-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search appointments by Patient name, MRN, Doctor, or Reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${dateRange === 'all' ? 'active' : ''}`}
              onClick={() => setDateRange('all')}
            >
              All Dates
            </button>
            <button
              type="button"
              className={`segment-btn ${dateRange === 'today' ? 'active' : ''}`}
              onClick={() => setDateRange('today')}
            >
              Today Only
            </button>
            <button
              type="button"
              className={`segment-btn ${dateRange === 'upcoming' ? 'active' : ''}`}
              onClick={() => setDateRange('upcoming')}
            >
              Upcoming
            </button>
          </div>

          <div className="segmented-control">
            {(
              [
                'All',
                'Confirmed',
                'In-Queue',
                'In-Consultation',
                'Completed',
                'Cancelled',
              ] as const
            ).map((st) => (
              <button
                key={st}
                type="button"
                className={`segment-btn ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="med-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient Details</th>
                <th>Attending Doctor</th>
                <th>Type & Duration</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Notes / Clinical Reason</th>
                <th>Workflow Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <CalendarCheck size={32} className="text-muted mb-2" />
                    <p>No appointments match the selected criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div className="time-primary-text">
                        <Clock size={13} className="time-icon" />
                        <strong>{apt.time}</strong>
                      </div>
                      <div className="date-sub-text">{apt.date}</div>
                    </td>
                    <td>
                      <div className="table-patient-name">{apt.patientName}</div>
                      <span className="mrn-badge-sm">{apt.patientMrn}</span>
                    </td>
                    <td>
                      <div className="table-doc-name">{apt.doctorName}</div>
                      <div className="table-doc-sub">
                        {apt.department} {apt.roomNumber ? `• ${apt.roomNumber}` : ''}
                      </div>
                    </td>
                    <td>
                      <span className="type-tag">{apt.type}</span>
                      <div className="duration-sub-text">{apt.durationMinutes} mins</div>
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
                    <td className="notes-col">
                      <p className="table-notes-text" title={apt.notes}>
                        {apt.notes || 'Routine consultation scheduled.'}
                      </p>
                    </td>
                    <td>
                      <div className="table-action-btns">
                        {apt.status === 'Confirmed' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => updateAppointmentStatus(apt.id, 'In-Queue')}
                            title="Check in patient to waiting room"
                          >
                            Check-In
                          </button>
                        )}

                        {apt.status === 'In-Queue' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-xs"
                            onClick={() => updateAppointmentStatus(apt.id, 'In-Consultation')}
                            title="Begin consultation encounter"
                          >
                            <PlayCircle size={13} />
                            Start
                          </button>
                        )}

                        {apt.status === 'In-Consultation' && (
                          <button
                            type="button"
                            className="btn btn-success btn-xs"
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            title="Mark encounter completed"
                          >
                            <CheckCircle2 size={13} />
                            Finish
                          </button>
                        )}

                        {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                          <button
                            type="button"
                            className="btn-icon-danger btn-xs"
                            onClick={() => {
                              if (confirm(`Cancel appointment for ${apt.patientName}?`)) {
                                cancelAppointment(apt.id);
                              }
                            }}
                            title="Cancel appointment"
                          >
                            <XCircle size={14} />
                          </button>
                        )}

                        {apt.status === 'Completed' && (
                          <span className="text-muted text-xs">Enc. Closed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
