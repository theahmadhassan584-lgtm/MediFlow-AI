import { useState, type FormEvent } from 'react';
import { X, Calendar, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import type {
  Patient,
  Doctor,
  AppointmentType,
  PriorityLevel,
} from '../../types/index.ts';

interface PreselectedData {
  patient?: Patient;
  doctor?: Doctor;
  defaultDate?: string;
  defaultTime?: string;
}

export const BookAppointmentModal: React.FC = () => {
  const { patients, doctors, modal, addAppointment, closeModal } = useApp();

  const preselected = (modal.data as PreselectedData) || {};

  const [patientId, setPatientId] = useState(preselected.patient?.id || patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(preselected.doctor?.id || doctors[0]?.id || '');
  const [date, setDate] = useState(
    preselected.defaultDate || new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState(preselected.defaultTime || '10:00 AM');
  const [duration, setDuration] = useState<number>(30);
  const [type, setType] = useState<AppointmentType>('Specialist Consultation');
  const [priority, setPriority] = useState<PriorityLevel>('Routine');
  const [notes, setNotes] = useState('');

  const selectedPatient = patients.find((p) => p.id === patientId);
  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  const timeSlots = [
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:15 AM',
    '01:00 PM',
    '01:45 PM',
    '02:30 PM',
    '03:15 PM',
    '04:00 PM',
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedPatient || !selectedDoctor) {
      return;
    }

    addAppointment({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      patientMrn: selectedPatient.mrn,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date,
      time,
      durationMinutes: duration,
      type,
      status: 'Confirmed',
      priority,
      notes: notes.trim() || `${type} appointment booked via MediFlow Clinical Portal.`,
      roomNumber: selectedDoctor.roomNumber,
    });

    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="book-appointment-title"
      >
        <div className="modal-header">
          <div className="modal-header-info">
            <h3 id="book-appointment-title">Schedule Clinical Consultation</h3>
            <p className="modal-subtitle">Reserve provider time, room allocation, and patient queue</p>
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

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Select Patient *</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} — ({p.mrn}) • {p.department}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Attending Specialist Doctor *</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialty} ({d.department}) • {d.roomNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Appointment Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Time Slot *</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Consultation Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AppointmentType)}
              >
                <option value="General Checkup">General Checkup</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Specialist Consultation">Specialist Consultation</option>
                <option value="Emergency">Emergency</option>
                <option value="Lab Review">Lab Review</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Reason for Visit / Clinical Notes</label>
            <textarea
              rows={3}
              placeholder="e.g. Follow-up for chest tightness, evaluate latest ECG & prescribe medication adjustment."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {selectedDoctor && (
            <div className="booking-summary-banner">
              <Stethoscope size={16} />
              <div className="summary-text">
                Assigned to <strong>{selectedDoctor.name}</strong> at{' '}
                <strong>{selectedDoctor.roomNumber}</strong>. Estimated duration: {duration} mins.
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Calendar size={15} />
              Confirm & Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
