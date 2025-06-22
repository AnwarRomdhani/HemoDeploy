import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import {
  getPatientDetails,
  getDoctors,
  getTypeHemo,
  getTransmittableDiseaseRef,
  getComplicationsRef,
  getTransplantationRef,
  declarePatientDeceased,
} from '../../api/patients';
import Modal from './Modal';
import HemodialysisForm from './HemodialysisForm';
import TransmittableDiseaseForm from './TransmittableDiseaseForm';
import ComplicationsForm from './ComplicationsForm';
import TransplantationForm from './TransplantationForm';
import SideMenu from '../SideMenu';
import Header from '../Header';
import './PatientMedicalActivity.css';

// Prediction Result Modal Component
const PredictionResultModal = ({ isOpen, onClose, predictionData }) => {
  if (!isOpen || !predictionData) return null;

  // Map prediction values to categories and descriptions
  const predictionMap = {
    0: {
      title: 'Inefficient Dialysis',
      description:
        'This category indicates that the dialysis session did not meet the minimum adequacy standard. A Kt/V below 1.2 suggests that the patient did not receive sufficient clearance of toxins during treatment, which may put them at higher risk of complications over time. In such cases, adjustments to dialysis duration, frequency, or efficiency may be required to improve treatment outcomes.',
    },
    1: {
      title: 'Borderline Dialysis',
      description:
        'This range reflects a dialysis session that meets the bare minimum threshold (Kt/V ≥ 1.2) but falls short of the optimal target of 1.4. While the session may be clinically acceptable, it may not provide the most protective level of toxin removal. Patients in this category may require closer monitoring, especially if they repeatedly fall in this zone, to ensure consistent long-term adequacy.',
    },
    2: {
      title: 'Efficient Dialysis (Kt/V ≥ 1.4)',
      description:
        'This class represents an optimal dialysis session where the delivered Kt/V meets or exceeds the recommended target. It indicates effective clearance of waste products from the blood, suggesting that the patient likely received an adequate and well-dosed treatment. Sessions in this category align with best-practice guidelines and are considered clinically desirable.',
    },
  };

  // Get prediction details or default to error state
  const predictionDetails = predictionData.error
    ? null
    : predictionMap[predictionData.prediction] || {
      title: 'Unknown Prediction',
      description: 'No description available for this prediction.',
    };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '1.5em', color: '#2c3e50' }}>Dialysis Prediction Result</h2>
        {predictionData.error ? (
          <div style={{ color: '#dc3545', marginBottom: '15px', fontSize: '1em' }}>
            Error: {predictionData.error}
          </div>
        ) : (
          <div style={{ marginBottom: '15px' }}>
            <p style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#2980b9' }}>
              {predictionDetails.title}
            </p>
            <p style={{ fontSize: '0.95em', lineHeight: '1.5', color: '#333' }}>
              {predictionDetails.description}
            </p>
            <p style={{ fontSize: '1em', marginTop: '10px', color: '#333' }}>
              <strong>Probabilities:</strong>
            </p>
            <ul style={{ paddingLeft: '20px', margin: '5px 0', fontSize: '0.95em', color: '#333' }}>
              <li>Inefficient Dialysis: {((predictionData.probability[0] || 0) * 100).toFixed(1)}%</li>
              <li>Borderline Dialysis: {((predictionData.probability[1] || 0) * 100).toFixed(1)}%</li>
              <li>Efficient Dialysis: {((predictionData.probability[2] || 0) * 100).toFixed(1)}%</li>
            </ul>
          </div>
        )}
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.95em',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientMedicalActivity = () => {
  const { apiBaseUrl } = useContext(TenantContext);
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [typeHemos, setTypeHemos] = useState([]);
  const [transmittableDiseases, setTransmittableDiseases] = useState([]);
  const [complications, setComplications] = useState([]);
  const [transplantations, setTransplantations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(null);
  const [predictionModalOpen, setPredictionModalOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('tenant-token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      if (!id || id === 'undefined') {
        setError('Invalid patient ID.');
        setLoading(false);
        return;
      }

      const patientResult = await getPatientDetails(apiBaseUrl, token, id);
      if (patientResult.success) {
        setPatient(patientResult.data);
      } else {
        setError(patientResult.error);
        setLoading(false);
        return;
      }

      const doctorsResult = await getDoctors(apiBaseUrl, token);
      if (doctorsResult.success) {
        setDoctors(doctorsResult.data);
      } else {
        setError(doctorsResult.error);
      }

      const typeHemoResult = await getTypeHemo(apiBaseUrl, token);
      if (typeHemoResult.success) {
        setTypeHemos(typeHemoResult.data);
      } else {
        setError(typeHemoResult.error);
      }

      const diseaseResult = await getTransmittableDiseaseRef(apiBaseUrl, token);
      if (diseaseResult.success) {
        setTransmittableDiseases(diseaseResult.data);
      } else {
        setError(diseaseResult.error);
      }

      const complicationResult = await getComplicationsRef(apiBaseUrl, token);
      if (complicationResult.success) {
        setComplications(complicationResult.data);
      } else {
        setError(complicationResult.error);
      }

      const transplantationResult = await getTransplantationRef(apiBaseUrl, token);
      if (transplantationResult.success) {
        setTransplantations(transplantationResult.data);
      } else {
        setError(transplantationResult.error);
      }

      setLoading(false);
    };

    fetchData();
  }, [apiBaseUrl, id]);

  const openModal = (formType) => {
    setModalOpen(formType);
  };

  const closeModal = () => {
    setModalOpen(null);
  };

  const closePredictionModal = () => {
    setPredictionModalOpen(false);
    setPredictionResult(null);
  };

  const handleFormSubmit = async (refreshRefs, formType) => {
    const token = localStorage.getItem('tenant-token');
    if (refreshRefs) {
      if (formType === 'disease') {
        const diseaseResult = await getTransmittableDiseaseRef(apiBaseUrl, token);
        if (diseaseResult.success) setTransmittableDiseases(diseaseResult.data);
      } else if (formType === 'complication') {
        const complicationResult = await getComplicationsRef(apiBaseUrl, token);
        if (complicationResult.success) setComplications(complicationResult.data);
      } else if (formType === 'transplantation') {
        const transplantationResult = await getTransplantationRef(apiBaseUrl, token);
        if (transplantationResult.success) setTransplantations(transplantationResult.data);
      }
    }
    const patientResult = await getPatientDetails(apiBaseUrl, token, id);
    if (patientResult.success) {
      setPatient(patientResult.data);
    }
  };

  const callPredictionApi = async (session) => {
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setPredictionResult({ error: 'No token found. Please log in.' });
      setPredictionModalOpen(true);
      return;
    }

    const kidneyFailureCause = { Hypertension: 0, Other: 0 };
    if (session.kidney_failure_cause === 'Hypertension') kidneyFailureCause.Hypertension = 1;
    else if (session.kidney_failure_cause === 'Other') kidneyFailureCause.Other = 1;

    const vascularAccessType = { Fistula: 0, Graft: 0 };
    if (session.vascular_access_type === 'Fistula') vascularAccessType.Fistula = 1;
    else if (session.vascular_access_type === 'Graft') vascularAccessType.Graft = 1;

    const dialyzerType = { 'Low-flux': 0 };
    if (session.dialyzer_type === 'Low') dialyzerType['Low-flux'] = 1;

    const genderMap = { male: 1, female: 0 };
    const gender = genderMap[session.gender?.toLowerCase()] ?? 0;

    const diabetes = session.diabetes ? 1 : 0;
    const hypertension = session.hypertension ? 1 : 0;

    const severityMap = { mild: 0, moderate: 1, severe: 2 };
    const diseaseSeverity = severityMap[session.severity_of_case?.toLowerCase()] ?? 0;

    const ktvCategoryMap = { low: 0, medium: 1, high: 2 };
    const ktvCategory = ktvCategoryMap[session.ktv_category?.toLowerCase()] ?? 0;

    const payload = {
      age: Number(patient.age) || 0,
      Gender: patient.gender == 'M' ? 'male' : 'female',
      Weight: Number(patient.weight) || 0,
      Diabetes: patient.diabetes ? true : false,
      Hypertension: patient.hypertension ? true : false,
      Pre_dialysis_bp: Number(session.pre_dialysis_bp) || 0,
      during_dialysis_bp: Number(session.during_dialysis_bp) || 0,
      post_dialysis_bp: Number(session.post_dialysis_bp) || 0,
      heart_rate: Number(session.heart_rate) || 0,
      creatinine: Number(session.creatinine) || 0,
      urea: Number(session.urea) || 0,
      potassium: Number(session.potassium) || 0,
      hemoglobin: Number(session.hemoglobin) || 0,
      hematocrit: Number(session.hematocrit) || 0,
      albumin: Number(session.albumin) || 0,
      dialysis_duration: Number(session.dialysis_duration) || 0,
      //urr: Number(session.urr) || 0,
      urine_output: Number(session.urine_output) || 0,
      dty_weight: Number(session.dry_weight) || 0,
      fluid_removal_rate: Number(session.fluid_removal_rate) || 0,
      disease_severity: session.severity_of_case === 'Mild' ? '0' : 'Moderate' ? '1' : '2',
      kt_v:Number(session.kt_v),
      //'Kt/V Category': ktvCategory,
      //'Kidney Failure Cause_Hypertension': kidneyFailureCause.Hypertension,
      // 'Kidney Failure Cause_Other': kidneyFailureCause.Other,
      vascular_access_type: session.vascular_access_type.toLowerCase(),
      dialyzer_type: session.dialyzer_type.toLowerCase()

    };

    try {
      const response = await fetch(`${apiBaseUrl}predict-hemodialysis/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setPredictionResult(data);
      setPredictionModalOpen(true);
    } catch (error) {
      setPredictionResult({ error: `Failed to fetch prediction: ${error.message}` });
      setPredictionModalOpen(true);
    }
  };

  const handleDeclareDeceased = async () => {
    const deceaseNote = window.prompt('Enter decease note:');
    if (deceaseNote === null) return;
    const token = localStorage.getItem('tenant-token');
    const result = await declarePatientDeceased(apiBaseUrl, token, id, deceaseNote);
    if (result.success) {
      const patientResult = await getPatientDetails(apiBaseUrl, token, id);
      if (patientResult.success) setPatient(patientResult.data);
    } else {
      setError(result.error);
    }
  };

  if (loading) return <div className="section-container">Loading...</div>;
  if (error) return <div className="section-container error">{error}</div>;

  const isDeceased = patient.status === 'DECEASED';

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <SideMenu />
        <div className="content-area">
          <h2 className="content-header">Patient Medical Activity</h2>
          <div className="medical-activity-layout">
            <div className="patient-details-container">
              <h3>Patient Details</h3>
              <div className="patient-details">
                <p><strong>Name:</strong> {patient.prenom} {patient.nom}</p>
                <p><strong>CIN:</strong> {patient.cin}</p>
                <p><strong>Age:</strong> {patient.age ?? 'N/A'}</p>
                <p><strong>Gender:</strong> {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'N/A'}</p>
                <p><strong>Blood Type:</strong> {patient.blood_type ?? 'N/A'}</p>
                <p><strong>CNAM Number:</strong> {patient.cnam__number ?? 'N/A'}</p>
                <p><strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : 'N/A'}</p>
                <p><strong>Entry Date:</strong> {new Date(patient.entry_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {patient.status}</p>
                {patient.status === 'DECEASED' && (
                  <p><strong>Decease Note:</strong> {patient.decease_note ?? 'N/A'}</p>
                )}
                <p><strong>Previously Dialysed:</strong> {patient.previously_dialysed ? 'Yes' : 'No'}</p>
                <p><strong>First Dialysis Date:</strong> {patient.date_first_dialysis ? new Date(patient.date_first_dialysis).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Hypertension:</strong> {patient.hypertension ? 'Yes' : 'No'}</p>
                <p><strong>Diabetes:</strong> {patient.diabetes ? 'Yes' : 'No'}</p>
              </div>

              {patient.status === 'ALIVE' && (
                <div className="action-buttons">
                  <button className="action-button danger" onClick={handleDeclareDeceased}>
                    Declare Deceased
                  </button>
                </div>
              )}
            </div>
            <div className="activity-tables-container">
              <div className="activity-section">
                <div className="content-header">
                  <h3>Hemodialysis Sessions</h3>
                  <div className="action-buttons">
                    <button
                      className="action-button"
                      onClick={() => openModal('hemodialysis')}
                      disabled={isDeceased}
                    >
                      Add Hemodialysis Session
                    </button>
                  </div>
                </div>
                <Modal
                  isOpen={modalOpen === 'hemodialysis'}
                  onClose={closeModal}
                  title="Add Hemodialysis Session"
                >
                  <HemodialysisForm
                    apiBaseUrl={apiBaseUrl}
                    token={localStorage.getItem('tenant-token')}
                    patientId={id}
                    doctors={doctors}
                    typeHemos={typeHemos}
                    onSubmit={() => handleFormSubmit(false, 'hemodialysis')}
                    onClose={closeModal}
                  />
                </Modal>
                {patient.hemodialysis_sessions.length === 0 ? (
                  <p className="no-data">No sessions recorded.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="activity-table hemo-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Type</th>
                          <th>Method</th>
                          <th>Date</th>
                          <th>Doc</th>
                          <th>Pre BP</th>
                          <th>During BP</th>
                          <th>Post BP</th>
                          <th>HR</th>
                          <th>Creat</th>
                          <th>Urea</th>
                          <th>K+</th>
                          <th>Hb</th>
                          <th>Hct</th>
                          <th>Alb</th>
                          <th>Kt/V</th>
                          <th>Urine</th>
                          <th>Dry Wt</th>
                          <th>Fluid</th>
                          <th>Dur</th>
                          <th>Vasc</th>
                          <th>Dial</th>
                          <th>Severity</th>
                          <th>Pred</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.hemodialysis_sessions.map((session) => (
                          <tr key={session.id}>
                            <td>{session.id}</td>
                            <td>{session.type__name ?? 'N/A'}</td>
                            <td>{session.method__name ?? 'N/A'}</td>
                            <td>{session.date_of_session ? new Date(session.date_of_session).toLocaleDateString() : 'N/A'}</td>
                            <td>{session.responsible_doc__prenom ?? ''} {session.responsible_doc__nom ?? 'N/A'}</td>
                            <td>{session.pre_dialysis_bp ?? 'N/A'}</td>
                            <td>{session.during_dialysis_bp ?? 'N/A'}</td>
                            <td>{session.post_dialysis_bp ?? 'N/A'}</td>
                            <td>{session.heart_rate ?? 'N/A'}</td>
                            <td>{session.creatinine ?? 'N/A'}</td>
                            <td>{session.urea ?? 'N/A'}</td>
                            <td>{session.potassium ?? 'N/A'}</td>
                            <td>{session.hemoglobin ?? 'N/A'}</td>
                            <td>{session.hematocrit ?? 'N/A'}</td>
                            <td>{session.albumin ?? 'N/A'}</td>
                            <td>{session.kt_v ?? 'N/A'}</td>
                            <td>{session.urine_output ?? 'N/A'}</td>
                            <td>{session.dry_weight ?? 'N/A'}</td>
                            <td>{session.fluid_removal_rate ?? 'N/A'}</td>
                            <td>{session.dialysis_duration ?? 'N/A'}</td>
                            <td>{session.vascular_access_type ?? 'N/A'}</td>
                            <td>{session.dialyzer_type ?? 'N/A'}</td>
                            <td>{session.severity_of_case ?? 'N/A'}</td>
                            <td>
                              <button onClick={() => callPredictionApi(session)} disabled={isDeceased}>
                                Predict
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="activity-section">
                <div className="content-header">
                  <h3>Transmittable Diseases</h3>
                  <div className="action-buttons">
                    <button
                      className="action-button"
                      onClick={() => openModal('disease')}
                      disabled={isDeceased}
                    >
                      Add Transmittable Disease
                    </button>
                  </div>
                </div>
                <Modal
                  isOpen={modalOpen === 'disease'}
                  onClose={closeModal}
                  title="Add Transmittable Disease"
                >
                  <TransmittableDiseaseForm
                    apiBaseUrl={apiBaseUrl}
                    token={localStorage.getItem('tenant-token')}
                    patientId={id}
                    diseases={transmittableDiseases}
                    onSubmit={(refresh) => handleFormSubmit(refresh, 'disease')}
                    onClose={closeModal}
                  />
                </Modal>
                {patient.transmittable_diseases.length === 0 ? (
                  <p className="no-data">No diseases recorded.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="activity-table disease-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Disease</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.transmittable_diseases.map((disease) => (
                          <tr key={disease.id}>
                            <td>{disease.id}</td>
                            <td>{disease.disease__label_disease ?? 'N/A'}</td>
                            <td>{disease.date_of_contraction ? new Date(disease.date_of_contraction).toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="activity-section">
                <div className="content-header">
                  <h3>Complications</h3>
                  <div className="action-buttons">
                    <button
                      className="action-button"
                      onClick={() => openModal('complication')}
                      disabled={isDeceased}
                    >
                      Add Complication
                    </button>
                  </div>
                </div>
                <Modal
                  isOpen={modalOpen === 'complication'}
                  onClose={closeModal}
                  title="Add Complication"
                >
                  <ComplicationsForm
                    apiBaseUrl={apiBaseUrl}
                    token={localStorage.getItem('tenant-token')}
                    patientId={id}
                    complications={complications}
                    onSubmit={(refresh) => handleFormSubmit(refresh, 'complication')}
                    onClose={closeModal}
                  />
                </Modal>
                {patient.complications.length === 0 ? (
                  <p className="no-data">No complications recorded.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="activity-table complication-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Comp</th>
                          <th>Date</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.complications.map((complication) => (
                          <tr key={complication.id}>
                            <td>{complication.id}</td>
                            <td>{complication.complication__label_complication ?? 'N/A'}</td>
                            <td>{complication.date_of_contraction ? new Date(complication.date_of_contraction).toLocaleDateString() : 'N/A'}</td>
                            <td>{complication.notes ?? 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="activity-section">
                <div className="content-header">
                  <h3>Transplantations</h3>
                  <div className="action-buttons">
                    <button
                      className="action-button"
                      onClick={() => openModal('transplantation')}
                      disabled={isDeceased}
                    >
                      Add Transplantation
                    </button>
                  </div>
                </div>
                <Modal
                  isOpen={modalOpen === 'transplantation'}
                  onClose={closeModal}
                  title="Add Transplantation"
                >
                  <TransplantationForm
                    apiBaseUrl={apiBaseUrl}
                    token={localStorage.getItem('tenant-token')}
                    patientId={id}
                    transplantations={transplantations}
                    onSubmit={(refresh) => handleFormSubmit(refresh, 'transplantation')}
                    onClose={closeModal}
                  />
                </Modal>
                {patient.transplantations.length === 0 ? (
                  <p className="no-data">No transplantations recorded.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="activity-table transplant-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Trans</th>
                          <th>Date</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.transplantations.map((transplantation) => (
                          <tr key={transplantation.id}>
                            <td>{transplantation.id}</td>
                            <td>{transplantation.transplantation__label_transplantation ?? 'N/A'}</td>
                            <td>{transplantation.date_operation ? new Date(transplantation.date_operation).toLocaleDateString() : 'N/A'}</td>
                            <td>{transplantation.notes ?? 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <button className="action-button" onClick={() => navigate('/home/patients')}>
                  Back to Patients
                </button>
              </div>
            </div>
          </div>
          <PredictionResultModal
            isOpen={predictionModalOpen}
            onClose={closePredictionModal}
            predictionData={predictionResult}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalActivity;