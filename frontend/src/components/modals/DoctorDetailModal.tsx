import { X, Calendar, Star, Clock, MapPin, Mail, Phone, Award, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import type { Doctor } from '../../types/index.ts';

export const DoctorDetailModal = () => {
  const { modal, closeModal, openModal } = useApp();

  const doctor = modal.data as Doctor;
  if (!doctor) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="doctor-detail-title"
      >
        <div className="doctor-modal-header">
          <div className="doctor-main-info">
            <img src={doctor.avatarUrl} alt={doctor.name} className="doctor-modal-avatar" />
            <div>
              <div className="doctor-name-row">
                <h3 id="doctor-detail-title">{doctor.name}</h3>
                <span className={`status-badge sm ${doctor.status.toLowerCase().replace(' ', '-')}`}>
                  {doctor.status}
                </span>
              </div>
              <div className="doctor-specialty-line">
                {doctor.specialty} • {doctor.department}
              </div>
              <div className="doctor-rating-row">
                <Star size={14} className="star-filled" />
                <span className="rating-num">{doctor.rating}</span>
                <span className="rating-count">({doctor.reviewCount} verified patient reviews)</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="doctor-modal-body">
          <div className="doctor-stats-row">
            <div className="doc-stat-pill">
              <Award size={16} />
              <div>
                <span className="doc-stat-val">{doctor.experienceYears}+ Years</span>
                <span className="doc-stat-lbl">Experience</span>
              </div>
            </div>

            <div className="doc-stat-pill">
              <Users size={16} />
              <div>
                <span className="doc-stat-val">{doctor.activePatientsCount}</span>
                <span className="doc-stat-lbl">Active Patients</span>
              </div>
            </div>

            <div className="doc-stat-pill">
              <MapPin size={16} />
              <div>
                <span className="doc-stat-val">{doctor.roomNumber}</span>
                <span className="doc-stat-lbl">Consulting Room</span>
              </div>
            </div>
          </div>

          <div className="doctor-info-section">
            <h5>Credentials & Academic Background</h5>
            <p className="doctor-qualifications">{doctor.qualifications}</p>
          </div>

          <div className="doctor-info-section">
            <h5>Clinical Biography & Focus</h5>
            <p className="doctor-bio">{doctor.bio}</p>
          </div>

          <div className="doctor-info-section">
            <h5>Consulting Hours & Availability</h5>
            <div className="schedule-hours-box">
              <div className="hours-row">
                <Clock size={15} />
                <span>{doctor.consultingHours}</span>
              </div>
              <div className="days-row">
                <span>Active Roster:</span>
                <div className="days-pills">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                    const isAvailable = doctor.availableDays.includes(day);
                    return (
                      <span key={day} className={`day-pill ${isAvailable ? 'available' : 'off'}`}>
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="doctor-info-section">
            <h5>Direct Contact</h5>
            <div className="contact-links-grid">
              <div className="contact-link-item">
                <Mail size={15} />
                <span>{doctor.email}</span>
              </div>
              <div className="contact-link-item">
                <Phone size={15} />
                <span>{doctor.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={closeModal}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              closeModal();
              openModal('bookAppointment', { doctor });
            }}
          >
            <Calendar size={15} />
            Book Consultation with {doctor.name}
          </button>
        </div>
      </div>
    </div>
  );
};
