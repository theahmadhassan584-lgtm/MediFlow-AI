export type PatientStatus = 'Inpatient' | 'Outpatient' | 'Critical' | 'Discharged';
export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface VitalSign {
  bloodPressure: string; // e.g. "120/80 mmHg"
  heartRate: number; // e.g. 74 bpm
  respiratoryRate: number; // e.g. 16 breaths/min
  temperature: number; // e.g. 98.6 F
  oxygenSaturation: number; // e.g. 98 %
  recordedAt: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  department: string;
  diagnosis: string;
  soapNotes?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  prescriptions: string[];
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number, e.g. "MRN-84920"
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  department: string;
  roomNumber?: string;
  admissionDate: string;
  status: PatientStatus;
  primaryDoctorId: string;
  primaryDoctorName: string;
  vitals: VitalSign;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  medicalHistory: MedicalRecord[];
}

export type DoctorStatus = 'Available' | 'In Surgery' | 'On Break' | 'Off Duty';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  activePatientsCount: number;
  status: DoctorStatus;
  roomNumber: string;
  email: string;
  phone: string;
  avatarUrl: string;
  availableDays: string[];
  consultingHours: string;
  bio: string;
}

export type AppointmentStatus =
  | 'Confirmed'
  | 'In-Queue'
  | 'In-Consultation'
  | 'Completed'
  | 'Cancelled';

export type AppointmentType =
  | 'General Checkup'
  | 'Follow-up'
  | 'Specialist Consultation'
  | 'Emergency'
  | 'Lab Review';

export type PriorityLevel = 'Routine' | 'Urgent' | 'Emergency';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  durationMinutes: number;
  type: AppointmentType;
  status: AppointmentStatus;
  priority: PriorityLevel;
  notes?: string;
  roomNumber?: string;
}

export type NotificationCategory = 'clinical' | 'lab' | 'system' | 'emergency';
export type NotificationSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  timestamp: string;
  isRead: boolean;
  linkTo?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: 'triage' | 'soap' | 'interaction' | 'general' | 'dosage';
  structuredData?: {
    title?: string;
    sections?: { label: string; content: string }[];
    warnings?: string[];
    recommendations?: string[];
  };
}

export interface DepartmentStat {
  name: string;
  totalPatients: number;
  bedOccupancyPercent: number;
  doctorsOnDuty: number;
  avgWaitTimeMinutes: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
