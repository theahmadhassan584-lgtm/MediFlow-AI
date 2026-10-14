import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.tsx';
import { Layout } from './components/layout/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Patients } from './pages/Patients.tsx';
import { Appointments } from './pages/Appointments.tsx';
import { Doctors } from './pages/Doctors.tsx';
import { Schedule } from './pages/Schedule.tsx';
import { AiAssistant } from './pages/AiAssistant.tsx';
import { Notifications } from './pages/Notifications.tsx';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="ai-assistant" element={<AiAssistant />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
