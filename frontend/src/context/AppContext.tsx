import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  Patient,
  Doctor,
  Appointment,
  AppointmentStatus,
  Notification,
  DepartmentStat,
  ToastMessage,
} from '../types/index.ts';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DEPARTMENT_STATS,
} from '../services/mockData.ts';

interface ModalState {
  type: 'newPatient' | 'bookAppointment' | 'patientDetail' | 'doctorDetail' | null;
  data?: unknown;
}

interface AppContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  notifications: Notification[];
  departmentStats: DepartmentStat[];
  toasts: ToastMessage[];
  searchQuery: string;
  selectedDepartment: string;
  modal: ModalState;
  unreadCount: number;

  // Actions
  addPatient: (patientData: Omit<Patient, 'id' | 'mrn'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addAppointment: (aptData: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  openModal: (type: ModalState['type'], data?: unknown) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedDepartment: (dept: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENTS: 'mediflow_patients_v1',
  DOCTORS: 'mediflow_doctors_v1',
  APPOINTMENTS: 'mediflow_appointments_v1',
  NOTIFICATIONS: 'mediflow_notifications_v1',
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // 1. Initialize state with localStorage fallbacks
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [doctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [departmentStats] = useState<DepartmentStat[]>(INITIAL_DEPARTMENT_STATS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [modal, setModal] = useState<ModalState>({ type: null });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.warn('Failed to save patients to localStorage', e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Failed to save appointments to localStorage', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e);
    }
  }, [notifications]);

  // Toast utility
  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'mrn'>): Patient => {
    const newId = `pat-${Date.now()}`;
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newMrn = `MRN-${randomDigits}`;

    const newPatient: Patient = {
      ...patientData,
      id: newId,
      mrn: newMrn,
    };

    setPatients((prev) => [newPatient, ...prev]);
    addToast('Patient Registered', `${newPatient.firstName} ${newPatient.lastName} (${newMrn}) added successfully.`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Record Updated', 'Patient records saved successfully.');
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    addToast('Patient Removed', 'Patient record was removed from the active database.', 'info');
  };

  // Appointment Actions
  const addAppointment = (aptData: Omit<Appointment, 'id'>): Appointment => {
    const newId = `apt-${Date.now()}`;
    const newApt: Appointment = {
      ...aptData,
      id: newId,
    };

    setAppointments((prev) => [newApt, ...prev]);
    addToast('Appointment Booked', `Scheduled for ${newApt.patientName} on ${newApt.date} at ${newApt.time}.`);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    addToast('Status Updated', `Appointment marked as "${status}".`, 'info');
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'Cancelled' as AppointmentStatus } : apt))
    );
    addToast('Appointment Cancelled', 'The scheduled appointment was cancelled.', 'warning');
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Modal Actions
  const openModal = (type: ModalState['type'], data?: unknown) => {
    setModal({ type, data });
  };

  const closeModal = () => {
    setModal({ type: null, data: undefined });
  };

  return (
    <AppContext.Provider
      value={{
        patients,
        doctors,
        appointments,
        notifications,
        departmentStats,
        toasts,
        searchQuery,
        selectedDepartment,
        modal,
        unreadCount,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        markNotificationRead,
        markAllNotificationsRead,
        addToast,
        removeToast,
        openModal,
        closeModal,
        setSearchQuery,
        setSelectedDepartment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
