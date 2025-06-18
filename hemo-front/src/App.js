import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TenantProvider, TenantContext } from './context/TenantContext';
import Home from './components/center.components/Home';
import Login from './components/Login';
import Patients from './components/Patients.components/Patients';
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import AdministrativeStaffList from './components/Staff.components/AdministrativeStaffList';
import MedicalStaffList from './components/Staff.components/MedicalStaffList';
import ParamedicalStaffList from './components/Staff.components/ParamedicalStaffList';
import TechnicalStaffList from './components/Staff.components/TechnicalStaffList';
import WorkerStaffList from './components/Staff.components/WorkerStaffList';
import AddAdministrativeStaffForm from './components/Staff.components/AddAdministrativeStaffForm';
import AddMedicalStaffForm from './components/Staff.components/AddMedicalStaffForm';
import AddParamedicalStaffForm from './components/Staff.components/AddParamedicalStaffForm';
import AddTechnicalStaffForm from './components/Staff.components/AddTechnicalStaffForm';
import AddWorkerStaffForm from './components/Staff.components/AddWorkerStaffForm';
import EditMedicalStaffForm from './components/Staff.components/EditMedicalStaffForm';
import EditParamedicalStaffForm from './components/Staff.components/EditParamedicalStaffForm';
import EditAdministrativeStaffForm from './components/Staff.components/EditAdministrativeStaffForm';
import EditWorkerStaffForm from './components/Staff.components/EditWorkerStaffForm';
import EditTechnicalStaffForm from './components/Staff.components/EditTechnicalStaffForm';
import MachineList from './components/equipement.components/MachineList';
import PatientMedicalActivity from './components/Patients.components/PatientMedicalActivity';
import AddMachine from './components/equipement.components/AddMachine';
import EditMachine from './components/equipement.components/EditMachine';
import VerifyEmail from './components/VerifyEmail';
import ExportReport from './components/ExportReport';
import CenterDetails from './components/center.components/CenterDetails';
import SuperAdminLogin from './components/Superadmin.components/SuperAdminLogin';
import SuperAdminDashboard from './components/Superadmin.components/SuperAdminDashboard';
import AddCenter from './components/Superadmin.components/AddCenter';
import UserProfile from './components/UserProfile';
import './App.css';

const PrivateRoute = ({ children, isSuperAdminRoute = false }) => {
  const { isValidSubdomain, isRoot } = useContext(TenantContext);
  const location = useLocation();
  const auth = isSuperAdminRoute
    ? localStorage.getItem('super-admin-token')
    : localStorage.getItem('tenant-token');
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';

  if (isSuperAdminRoute) {
    if (!isSuperAdmin || !auth) {
      return <Navigate to="/superadmin/login" replace state={{ from: location }} />;
    }
  } else {
    if (!auth || !isValidSubdomain) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  return children;
};

const AppContent = () => {
  const { isValidSubdomain, subdomainError, isRoot } = useContext(TenantContext);
  const location = useLocation();

  if (location.pathname.startsWith('/superadmin') || location.pathname === '/verify-email') {
    return (
      <div className="app-container">
        <Routes>
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route
            path="/superadmin/dashboard"
            element={
              <PrivateRoute isSuperAdminRoute={true}>
                <SuperAdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/add-center"
            element={
              <PrivateRoute isSuperAdminRoute={true}>
                <AddCenter />
              </PrivateRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<Navigate to="/superadmin/login" replace />} />
        </Routes>
      </div>
    );
  }

  if (isValidSubdomain === null) return <div className="app-container">Loading...</div>;
  if (isValidSubdomain === false && !isRoot) {
    return <div className="app-container">Error: {subdomainError}</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Navigate to={isRoot ? '/superadmin/login' : '/login'} replace />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <>
                <Header />
                <SideMenu />
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/home/patients" element={<Patients />} />
                  <Route path="/home/patients/:id/medical-activity" element={<PatientMedicalActivity />} />
                  <Route path="/home/staff/administrative" element={<AdministrativeStaffList />} />
                  <Route path="/home/staff/administrative/add" element={<AddAdministrativeStaffForm />} />
                  <Route path="/home/staff/administrative/edit/:id" element={<EditAdministrativeStaffForm />} />
                  <Route path="/home/staff/medical" element={<MedicalStaffList />} />
                  <Route path="/home/staff/medical/add" element={<AddMedicalStaffForm />} />
                  <Route path="/home/staff/medical/edit/:id" element={<EditMedicalStaffForm />} />
                  <Route path="/home/staff/paramedical" element={<ParamedicalStaffList />} />
                  <Route path="/home/staff/paramedical/add" element={<AddParamedicalStaffForm />} />
                  <Route path="/home/staff/paramedical/edit/:id" element={<EditParamedicalStaffForm />} />
                  <Route path="/home/staff/technical" element={<TechnicalStaffList />} />
                  <Route path="/home/staff/technical/add" element={<AddTechnicalStaffForm />} />
                  <Route path="/home/staff/technical/edit/:id" element={<EditTechnicalStaffForm />} />
                  <Route path="/home/staff/worker" element={<WorkerStaffList />} />
                  <Route path="/home/staff/worker/add" element={<AddWorkerStaffForm />} />
                  <Route path="/home/staff/worker/edit/:id" element={<EditWorkerStaffForm />} />
                  <Route path="/home/equipment/list" element={<MachineList />} />
                  <Route path="/home/equipment/add" element={<AddMachine />} />
                  <Route path="/home/equipment/edit/:id" element={<EditMachine />} />
                  <Route path="/home/export-report" element={<ExportReport />} />
                  <Route path="/home/center-details" element={<CenterDetails />} />
                  <Route path="/home/user-profile" element={<UserProfile />} />
                </Routes>
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <TenantProvider>
        <AppContent />
      </TenantProvider>
    </Router>
  );
};

export default App;