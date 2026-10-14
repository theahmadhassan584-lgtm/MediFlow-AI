import { useState, type FormEvent } from 'react';
import { X, User, Heart, ShieldAlert, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import type { Gender, BloodGroup, PatientStatus } from '../../types/index.ts';

export const NewPatientModal = () => {
  const { doctors, addPatient, closeModal } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<Gender>('Female');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('Cardiology');
  const [roomNumber, setRoomNumber] = useState('');
  const [status, setStatus] = useState<PatientStatus>('Inpatient');
  const [primaryDoctorId, setPrimaryDoctorId] = useState(doctors[0]?.id || 'doc-1');

  // Vitals
  const [bp, setBp] = useState('120/80 mmHg');
  const [hr, setHr] = useState<number>(72);
  const [spo2, setSpo2] = useState<number>(98);
  const [temp, setTemp] = useState<number>(98.6);

  // Clinical
  const [allergiesText, setAllergiesText] = useState('No known drug allergies (NKDA)');
  const [conditionsText, setConditionsText] = useState('Hypertension');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!phone.trim()) newErrors.phone = 'Contact phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedDoc = doctors.find((d) => d.id === primaryDoctorId);

    const allergies = allergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const chronicConditions = conditionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addPatient({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: Number(age) || 30,
      gender,
      bloodGroup,
      phone: phone.trim(),
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@patient.mediflow.net`,
      address: address.trim() || 'St. Jude General Intake Ward',
      department,
      roomNumber: roomNumber.trim() || undefined,
      admissionDate: new Date().toISOString().split('T')[0],
      status,
      primaryDoctorId,
      primaryDoctorName: selectedDoc ? selectedDoc.name : 'Dr. Sarah Mitchell',
      vitals: {
        bloodPressure: bp.includes('mmHg') ? bp : `${bp} mmHg`,
        heartRate: Number(hr) || 72,
        respiratoryRate: 16,
        temperature: Number(temp) || 98.6,
        oxygenSaturation: Number(spo2) || 98,
        recordedAt: 'Just now',
      },
      allergies,
      chronicConditions,
      emergencyContact: {
        name: emergencyName.trim() || 'Primary Caregiver',
        relation: emergencyRelation.trim() || 'Family',
        phone: emergencyPhone.trim() || phone.trim(),
      },
      medicalHistory: [],
    });

    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-container modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="new-patient-title"
      >
        <div className="modal-header">
          <div className="modal-header-info">
            <h3 id="new-patient-title">Register New Clinical Patient</h3>
            <p className="modal-subtitle">Generate electronic health record and initial triage vitals</p>
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
          <div className="form-tabs-container">
            {/* Section 1: Demographics */}
            <div className="form-section">
              <div className="section-title">
                <User size={16} />
                <span>Demographics & Identity</span>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                    }}
                    className={errors.firstName ? 'input-error' : ''}
                  />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bennett"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                    }}
                    className={errors.lastName ? 'input-error' : ''}
                  />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Age (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State, ZIP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Section 2: Clinical Admission */}
            <div className="form-section">
              <div className="section-title">
                <Heart size={16} />
                <span>Admission & Initial Vitals</span>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Oncology">Oncology</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Patient Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PatientStatus)}
                  >
                    <option value="Inpatient">Inpatient</option>
                    <option value="Outpatient">Outpatient</option>
                    <option value="Critical">Critical (ICU)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Room/Bed</label>
                  <input
                    type="text"
                    placeholder="e.g. Ward 4A - Bed 02"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Attending Doctor</label>
                <select
                  value={primaryDoctorId}
                  onChange={(e) => setPrimaryDoctorId(e.target.value)}
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row-4">
                <div className="form-group">
                  <label>Blood Pressure</label>
                  <input
                    type="text"
                    placeholder="120/80"
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
            </div>

            {/* Section 3: Safety & Emergency */}
            <div className="form-section">
              <div className="section-title">
                <ShieldAlert size={16} />
                <span>Safety Flags & Emergency Contact</span>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Allergies (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa, Peanuts"
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Chronic Conditions</label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Asthma"
                    value={conditionsText}
                    onChange={(e) => setConditionsText(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Bennett"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Spouse"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 999-8888"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Phone size={15} />
              Register Patient & Assign MRN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
