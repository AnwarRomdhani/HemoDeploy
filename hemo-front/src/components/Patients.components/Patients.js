import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import { getPatients, declarePatientDeceased } from '../../api/patients';
import AddPatientForm from './AddPatientForm';
import axios from 'axios';
import './Patients.css';

const Patients = () => {
  const { apiBaseUrl } = useContext(TenantContext);
  const [patients, setPatients] = useState([]);
  const [cnams, setCnams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Lock/unlock body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalOpen]);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      // Fetch patients
      const patientsResult = await getPatients(apiBaseUrl, token);
      if (patientsResult.success) {
        setPatients(patientsResult.data);
      } else {
        setError(patientsResult.error);
      }

      // Fetch CNAM records
      const cnamsResponse = await axios.get(`${apiBaseUrl}cnams/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCnams(cnamsResponse.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeclareDeceased = async (patientId) => {
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const deceaseNote = prompt('Enter decease note (optional):');
    const result = await declarePatientDeceased(apiBaseUrl, token, patientId, deceaseNote);
    if (result.success) {
      setPatients(patients.map((patient) =>
        patient.id === patientId
          ? { ...patient, status: 'DECEASED', decease_note: deceaseNote || '' }
          : patient
      ));
    } else {
      setError(result.error);
    }
  };

  const handleConsultMedicalActivity = useCallback((patientId) => {
    ;
    navigate(`/home/patients/${patientId}/medical-activity`);
  }, [navigate]);

  const handleAddPatient = useCallback(() => {
    ;
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    ;
    setModalOpen(false);
  }, []);

  const handlePatientAdded = useCallback(async () => {
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const result = await getPatients(apiBaseUrl, token);
    if (result.success) {
      setPatients(result.data);
    } else {
      setError(result.error);
    }
    setModalOpen(false);
  }, [apiBaseUrl]);

  if (loading) {
    return <div className="section-container">Loading...</div>;
  }

  if (error) {
    return <div className="section-container error">{error}</div>;
  }

  return (
    <div className="patients-container">
      <div className="content-wrapper">
        <div className="content-header">
          <h2>Patient Records</h2>
          <button className="action-button add-patient" onClick={handleAddPatient}>
            Add Patient
          </button>
        </div>
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={handleCloseModal}>×</button>
              <AddPatientForm
                apiBaseUrl={apiBaseUrl}
                token={localStorage.getItem('tenant-token')}
                cnams={cnams}
                onSubmit={handlePatientAdded}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        )}
        {patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>CIN</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Blood Type</th>
                  <th>CNAM</th>
                  <th>Weight (kg)</th>
                  <th>Entry Date</th>
                  <th>Previously Dialysed</th>
                  <th>First Dialysis Date</th>
                  <th>Hypertension</th>
                  <th>Diabetes</th>
                  <th>Status</th>
                  <th>Decease Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.prenom} {patient.nom}</td>
                    <td>{patient.cin}</td>
                    <td>{patient.age || 'N/A'}</td>
                    <td>{patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'N/A'}</td>
                    <td>{patient.blood_type || 'N/A'}</td>
                    <td>{patient.cnam__number || 'N/A'}</td>
                    <td>{patient.weight || 'N/A'}</td>
                    <td>{new Date(patient.entry_date).toLocaleDateString()}</td>
                    <td>{patient.previously_dialysed ? 'Yes' : 'No'}</td>
                    <td>{patient.date_first_dialysis ? new Date(patient.date_first_dialysis).toLocaleDateString() : 'N/A'}</td>
                    <td>{patient.hypertension ? 'Yes' : 'No'}</td>
                    <td>{patient.diabetes ? 'Yes' : 'No'}</td>
                    <td>{patient.status}</td>
                    <td>{patient.status === 'DECEASED' ? patient.decease_note || 'N/A' : 'N/A'}</td>
                    <td className="action-buttons">
                      {patient.status !== 'DECEASED' && (
                        <button
                          className="action-button deceased-button"
                          onClick={() => handleDeclareDeceased(patient.id)}
                        >
                          Declare Deceased
                        </button>
                      )}
                      <button
                        className="action-button consult-button"
                        onClick={() => handleConsultMedicalActivity(patient.id)}
                      >
                        Consult Medical Activity
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Patients);