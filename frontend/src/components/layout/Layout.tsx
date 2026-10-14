import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { Header } from './Header.tsx';
import { ToastContainer } from '../ui/ToastContainer.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { NewPatientModal } from '../modals/NewPatientModal.tsx';
import { BookAppointmentModal } from '../modals/BookAppointmentModal.tsx';
import { PatientDetailModal } from '../modals/PatientDetailModal.tsx';
import { DoctorDetailModal } from '../modals/DoctorDetailModal.tsx';

export const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { modal } = useApp();

  return (
    <div className="mediflow-app-root">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <Header onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        <main className="app-page-container">
          <Outlet />
        </main>
      </div>

      {/* Toast Feedback */}
      <ToastContainer />

      {/* Dynamic Global Modals */}
      {modal.type === 'newPatient' && <NewPatientModal />}
      {modal.type === 'bookAppointment' && <BookAppointmentModal />}
      {modal.type === 'patientDetail' && <PatientDetailModal />}
      {modal.type === 'doctorDetail' && <DoctorDetailModal />}
    </div>
  );
};
