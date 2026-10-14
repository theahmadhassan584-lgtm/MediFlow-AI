import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Stethoscope,
  Calendar,
  Sparkles,
  Bell,
  Activity,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { patients, appointments, unreadCount } = useApp();

  const todayAppointmentsCount = appointments.filter(
    (a) => a.date === '2026-10-15' || a.status === 'In-Queue'
  ).length;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <Activity className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              Medi<span>Flow</span>
              <span className="brand-badge">AI</span>
            </div>
            <div className="brand-subtitle">Clinical Health Suite</div>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Hospital Facility Banner */}
        <div className="facility-card">
          <div className="facility-status-dot" />
          <div className="facility-info">
            <div className="facility-name">St. Jude Medical Center</div>
            <div className="facility-dept">Emergency & Inpatient Core</div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">CLINICAL SUITE</div>

          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} className="nav-icon" />
            <span className="nav-label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/patients"
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={20} className="nav-icon" />
            <span className="nav-label">Patients</span>
            <span className="nav-badge count">{patients.length}</span>
          </NavLink>

          <NavLink
            to="/appointments"
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <CalendarCheck size={20} className="nav-icon" />
            <span className="nav-label">Appointments</span>
            {todayAppointmentsCount > 0 && (
              <span className="nav-badge alert">{todayAppointmentsCount}</span>
            )}
          </NavLink>

          <NavLink
            to="/doctors"
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Stethoscope size={20} className="nav-icon" />
            <span className="nav-label">Doctors & Staff</span>
          </NavLink>

          <NavLink
            to="/schedule"
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Calendar size={20} className="nav-icon" />
            <span className="nav-label">Schedule & Rooms</span>
          </NavLink>

          <div className="nav-group-label" style={{ marginTop: '16px' }}>INTELLIGENCE & COMMS</div>

          <NavLink
            to="/ai-assistant"
            onClick={onClose}
            className={({ isActive }) => `nav-item ai-nav-item ${isActive ? 'active' : ''}`}
          >
            <Sparkles size={20} className="nav-icon ai-glow" />
            <span className="nav-label">AI Clinical Copilot</span>
            <span className="nav-badge ai-pill">Decision AI</span>
          </NavLink>

          <NavLink
            to="/notifications"
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Bell size={20} className="nav-icon" />
            <span className="nav-label">Alerts & Logs</span>
            {unreadCount > 0 && (
              <span className="nav-badge critical">{unreadCount}</span>
            )}
          </NavLink>
        </nav>

        {/* User Profile Bar */}
        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar-wrapper">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80"
                alt="Dr. Sarah Mitchell"
                className="user-avatar"
              />
              <span className="online-indicator" title="Active on Duty" />
            </div>
            <div className="user-details">
              <div className="user-name">Dr. Sarah Mitchell</div>
              <div className="user-role">Chief Medical Officer</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
