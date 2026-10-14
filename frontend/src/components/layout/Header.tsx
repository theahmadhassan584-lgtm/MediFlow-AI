import { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  UserPlus,
  CalendarPlus,
  Bell,
  Sparkles,
  ChevronDown,
  X,
  Stethoscope,
  User,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header = ({ onOpenMobileMenu }: HeaderProps) => {
  const {
    patients,
    doctors,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    openModal,
    selectedDepartment,
    setSelectedDepartment,
  } = useApp();

  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter patients and doctors matching the search query
  const matchingPatients = query.trim()
    ? patients.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
          p.mrn.toLowerCase().includes(query.toLowerCase()) ||
          p.phone.includes(query)
      ).slice(0, 4)
    : [];

  const matchingDoctors = query.trim()
    ? doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.specialty.toLowerCase().includes(query.toLowerCase()) ||
          d.department.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasSearchResults = matchingPatients.length > 0 || matchingDoctors.length > 0;

  const departments = [
    'All Departments',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Oncology',
    'General Medicine',
  ];

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Global Live Search Bar */}
        <div className="search-container" ref={searchRef}>
          <div className={`search-input-wrapper ${searchFocused ? 'focused' : ''}`}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by Patient name, MRN, Doctor, or Condition..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchFocused && query.trim().length > 1 && (
            <div className="search-results-dropdown">
              {!hasSearchResults ? (
                <div className="search-no-results">
                  <AlertCircle size={18} className="text-muted" />
                  <span>No matching patients or doctors found for &ldquo;{query}&rdquo;</span>
                </div>
              ) : (
                <>
                  {matchingPatients.length > 0 && (
                    <div className="search-section">
                      <div className="search-section-title">
                        <User size={13} />
                        <span>Patients</span>
                      </div>
                      {matchingPatients.map((p) => (
                        <div
                          key={p.id}
                          className="search-result-item"
                          onClick={() => {
                            openModal('patientDetail', p);
                            setSearchFocused(false);
                            setQuery('');
                          }}
                        >
                          <div className="result-avatar">
                            {p.firstName[0]}
                            {p.lastName[0]}
                          </div>
                          <div className="result-info">
                            <div className="result-name">
                              {p.firstName} {p.lastName}
                              <span className="result-pill">{p.mrn}</span>
                            </div>
                            <div className="result-meta">
                              {p.age} yrs • {p.gender} • {p.department} • BP: {p.vitals.bloodPressure}
                            </div>
                          </div>
                          <span className={`status-badge sm ${p.status.toLowerCase()}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingDoctors.length > 0 && (
                    <div className="search-section">
                      <div className="search-section-title">
                        <Stethoscope size={13} />
                        <span>Specialist Doctors</span>
                      </div>
                      {matchingDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="search-result-item"
                          onClick={() => {
                            openModal('doctorDetail', doc);
                            setSearchFocused(false);
                            setQuery('');
                          }}
                        >
                          <img src={doc.avatarUrl} alt={doc.name} className="result-avatar-img" />
                          <div className="result-info">
                            <div className="result-name">{doc.name}</div>
                            <div className="result-meta">
                              {doc.specialty} • {doc.roomNumber}
                            </div>
                          </div>
                          <span className="rating-pill">★ {doc.rating}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Department Filter Switcher */}
        <div className="dept-select-wrapper">
          <select
            className="dept-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept === 'All Departments' ? 'All' : dept}>
                {dept}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>

        {/* Quick Action: Register Patient */}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => openModal('newPatient')}
          title="Register New Patient"
        >
          <UserPlus size={16} />
          <span className="btn-label-desktop">New Patient</span>
        </button>

        {/* Quick Action: Book Appointment */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal('bookAppointment')}
          title="Schedule Appointment"
        >
          <CalendarPlus size={16} />
          <span className="btn-label-desktop">Book Appointment</span>
        </button>

        {/* Quick AI Clinical Copilot Link */}
        <button
          type="button"
          className="ai-quick-btn"
          onClick={() => navigate('/ai-assistant')}
          title="Open MediFlow AI Copilot"
        >
          <Sparkles size={17} />
          <span className="btn-label-desktop">AI Copilot</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="notification-bell-wrapper" ref={notifRef}>
          <button
            type="button"
            className="icon-button notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Open notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-popover">
              <div className="notif-popover-header">
                <div>
                  <h4>Clinical Alerts & Logs</h4>
                  <span className="notif-count-text">{unreadCount} unread items</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notif-mark-read"
                    onClick={markAllNotificationsRead}
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="notif-popover-list">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className={`notif-popover-item ${n.isRead ? 'read' : 'unread'}`}
                    onClick={() => {
                      if (n.linkTo) navigate(n.linkTo);
                      setShowNotifications(false);
                    }}
                  >
                    <div className={`notif-indicator ${n.severity}`} />
                    <div className="notif-item-body">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-message">{n.message}</div>
                      <div className="notif-item-time">{n.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notif-popover-footer">
                <button
                  type="button"
                  className="notif-view-all"
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifications(false);
                  }}
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
