import { useState } from 'react';
import {
  Stethoscope,
  Search,
  Star,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Doctors = () => {
  const { doctors, openModal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;

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
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Medical Staff & Specialist Directory</h2>
          <p className="page-subtitle">
            Attending physicians, surgeons, department heads, and consulting schedules
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-card">
        <div className="toolbar-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search doctors by name, specialty, qualifications, or department..."
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
                  {d === 'All' ? 'All Specialties' : d}
                </option>
              ))}
            </select>
          </div>

          <div className="segmented-control">
            {(['All', 'Available', 'In Surgery', 'On Break', 'Off Duty'] as const).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  className={`segment-btn ${selectedStatus === st ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(st)}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-meta-bar">
        <span>
          Showing <strong>{filteredDoctors.length}</strong> medical providers
        </span>
      </div>

      {/* Doctor Cards Grid */}
      <div className="doctors-grid">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 w-full col-span-full">
            <Stethoscope size={36} className="text-muted mb-2" />
            <p>No specialist doctors found matching your filter.</p>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="doctor-card"
              onClick={() => openModal('doctorDetail', doc)}
            >
              <div className="doctor-card-top">
                <div className="doctor-avatar-wrapper">
                  <img src={doc.avatarUrl} alt={doc.name} className="doctor-avatar" />
                  <span
                    className={`doctor-status-badge ${doc.status
                      .toLowerCase()
                      .replace(' ', '-')}`}
                    title={doc.status}
                  />
                </div>

                <div className="doctor-headline">
                  <div className="doctor-name-title">
                    <h4>{doc.name}</h4>
                    <span
                      className={`status-badge sm ${doc.status
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="doctor-specialty">{doc.specialty}</div>
                  <div className="doctor-dept-tag">{doc.department}</div>
                </div>
              </div>

              <div className="doctor-meta-strip">
                <div className="doctor-meta-item">
                  <Star size={14} className="star-filled" />
                  <span>
                    <strong>{doc.rating}</strong> ({doc.reviewCount})
                  </span>
                </div>
                <div className="doctor-meta-item">
                  <MapPin size={14} />
                  <span>{doc.roomNumber}</span>
                </div>
                <div className="doctor-meta-item">
                  <Clock size={14} />
                  <span>{doc.experienceYears}+ yrs exp</span>
                </div>
              </div>

              <p className="doctor-bio-snippet">{doc.bio}</p>

              <div className="doctor-roster-preview">
                <span className="roster-label">Clinic Roster:</span>
                <div className="roster-chips">
                  {doc.availableDays.map((d) => (
                    <span key={d} className="roster-chip">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="doctor-card-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => openModal('doctorDetail', doc)}
                >
                  <Eye size={14} />
                  Profile & Reviews
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => openModal('bookAppointment', { doctor: doc })}
                >
                  <Calendar size={14} />
                  Book Consult
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
