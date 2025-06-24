import React, { useState, useEffect } from 'react';
import { getMethodHemo, addHemodialysisSession } from '../../api/patients';
import './PatientMedicalActivity.css';

const HemodialysisForm = ({ apiBaseUrl, token, patientId, doctors, typeHemos, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    type: '',
    method: '',
    date_of_session: '',
    responsible_doc: '',
    pre_dialysis_bp: '',
    during_dialysis_bp: '',
    post_dialysis_bp: '',
    heart_rate: '',
    creatinine: '',
    urea: '',
    potassium: '',
    hemoglobin: '',
    hematocrit: '',
    albumin: '',
    kt_v: '',
    urine_output: '',
    dry_weight: '',
    fluid_removal_rate: '',
    dialysis_duration: '',
    vascular_access_type: '',
    dialyzer_type: '',
    severity_of_case: '',
  });
  const [methodHemos, setMethodHemos] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchMethodHemos = async () => {
      if (formData.type) {
        const methodHemoResult = await getMethodHemo(apiBaseUrl, token, formData.type);
        if (methodHemoResult.success) {
          setMethodHemos(methodHemoResult.data);
        } else {
          console.error('Failed to fetch method hemo:', methodHemoResult.error);
        }
      } else {
        setMethodHemos([]);
      }
    };
    fetchMethodHemos();
  }, [apiBaseUrl, token, formData.type]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.type) errors.type = 'Type is required.';
    if (!formData.method) errors.method = 'Method is required.';
    if (!formData.date_of_session) errors.date_of_session = 'Date is required.';
    if (!formData.responsible_doc) errors.responsible_doc = 'Doctor is required.';
    // Validate existing fields
    if (formData.pre_dialysis_bp && (formData.pre_dialysis_bp < 50 || formData.pre_dialysis_bp > 300)) {
      errors.pre_dialysis_bp = 'Must be between 50 and 300 mmHg.';
    }
    if (formData.during_dialysis_bp && (formData.during_dialysis_bp < 50 || formData.during_dialysis_bp > 300)) {
      errors.during_dialysis_bp = 'Must be between 50 and 300 mmHg.';
    }
    if (formData.post_dialysis_bp && (formData.post_dialysis_bp < 50 || formData.post_dialysis_bp > 300)) {
      errors.post_dialysis_bp = 'Must be between 50 and 300 mmHg.';
    }
    if (formData.heart_rate && (formData.heart_rate < 30 || formData.heart_rate > 200)) {
      errors.heart_rate = 'Must be between 30 and 200 bpm.';
    }
    // Validate new float fields
    if (formData.creatinine && (formData.creatinine < 0.5 || formData.creatinine > 20)) {
      errors.creatinine = 'Must be between 0.5 and 20 mg/dL.';
    }
    if (formData.urea && (formData.urea < 10 || formData.urea > 200)) {
      errors.urea = 'Must be between 10 and 200 mg/dL.';
    }
    if (formData.potassium && (formData.potassium < 2 || formData.potassium > 8)) {
      errors.potassium = 'Must be between 2 and 8 mEq/L.';
    }
    if (formData.hemoglobin && (formData.hemoglobin < 5 || formData.hemoglobin > 18)) {
      errors.hemoglobin = 'Must be between 5 and 18 g/dL.';
    }
    if (formData.hematocrit && (formData.hematocrit < 15 || formData.hematocrit > 55)) {
      errors.hematocrit = 'Must be between 15 and 55%.';
    }
    if (formData.albumin && (formData.albumin < 2 || formData.albumin > 5.5)) {
      errors.albumin = 'Must be between 2 and 5.5 g/dL.';
    }
    if (formData.kt_v && (formData.kt_v < 0.5 || formData.kt_v > 2.5)) {
      errors.kt_v = 'Must be between 0.5 and 2.5.';
    }
    if (formData.urine_output && (formData.urine_output < 0 || formData.urine_output > 2000)) {
      errors.urine_output = 'Must be between 0 and 2000 mL/day.';
    }
    if (formData.dry_weight && (formData.dry_weight < 30 || formData.dry_weight > 150)) {
      errors.dry_weight = 'Must be between 30 and 150 kg.';
    }
    if (formData.fluid_removal_rate && (formData.fluid_removal_rate < 0 || formData.fluid_removal_rate > 2000)) {
      errors.fluid_removal_rate = 'Must be between 0 and 2000 mL/hour.';
    }
    if (formData.dialysis_duration && (formData.dialysis_duration < 1 || formData.dialysis_duration > 8)) {
      errors.dialysis_duration = 'Must be between 1 and 8 hours.';
    }
    // Validate choice fields
    if (formData.vascular_access_type && !['Catheter', 'Graft', 'Fistula'].includes(formData.vascular_access_type)) {
      errors.vascular_access_type = 'Invalid vascular access type.';
    }
    if (formData.dialyzer_type && !['High', 'Low'].includes(formData.dialyzer_type)) {
      errors.dialyzer_type = 'Invalid dialyzer type.';
    }
    if (formData.severity_of_case && !['Mild', 'Moderate', 'Severe'].includes(formData.severity_of_case)) {
      errors.severity_of_case = 'Invalid severity level.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
      ;
    const result = await addHemodialysisSession(apiBaseUrl, token, patientId, formData);
    if (result.success) {
      onSubmit();
      onClose();
    } else {
      const formattedErrors = {};
      if (result.error && typeof result.error === 'object') {
        Object.keys(result.error).forEach((key) => {
          formattedErrors[key] = result.error[key][0]?.message || result.error[key][0] || result.error[key];
        });
      } else {
        formattedErrors.general = result.error || 'Failed to add hemodialysis session.';
      }
      setFormErrors(formattedErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.general && <span className="error">{formErrors.general}</span>}
      <div className="form-group">
        <label>Type:</label>
        <select
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
        >
          <option value="">Select Type</option>
          {typeHemos.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {formErrors.type && <span className="error">{formErrors.type}</span>}
      </div>
      <div className="form-group">
        <label>Method:</label>
        <select
          value={formData.method}
          onChange={(e) => handleInputChange('method', e.target.value)}
          disabled={!formData.type}
        >
          <option value="">Select Method</option>
          {methodHemos.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
        {formErrors.method && <span className="error">{formErrors.method}</span>}
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          value={formData.date_of_session}
          onChange={(e) => handleInputChange('date_of_session', e.target.value)}
        />
        {formErrors.date_of_session && <span className="error">{formErrors.date_of_session}</span>}
      </div>
      <div className="form-group">
        <label>Responsible Doctor:</label>
        <select
          value={formData.responsible_doc}
          onChange={(e) => handleInputChange('responsible_doc', e.target.value)}
        >
          <option value="">Select Medical Staff</option>
          {doctors.map((doctor) => (
            <option key={doctor.class_id} value={doctor.class_id}>
              {doctor.prenom} {doctor.nom}
            </option>
          ))}
        </select>
        {formErrors.responsible_doc && <span className="error">{formErrors.responsible_doc}</span>}
      </div>
      <div className="form-group">
        <label>Pre-Dialysis BP (mmHg):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter pre-dialysis BP"
          value={formData.pre_dialysis_bp}
          onChange={(e) => handleInputChange('pre_dialysis_bp', e.target.value)}
        />
        {formErrors.pre_dialysis_bp && <span className="error">{formErrors.pre_dialysis_bp}</span>}
      </div>
      <div className="form-group">
        <label>During-Dialysis BP (mmHg):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter during-dialysis BP"
          value={formData.during_dialysis_bp}
          onChange={(e) => handleInputChange('during_dialysis_bp', e.target.value)}
        />
        {formErrors.during_dialysis_bp && <span className="error">{formErrors.during_dialysis_bp}</span>}
      </div>
      <div className="form-group">
        <label>Post-Dialysis BP (mmHg):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter post-dialysis BP"
          value={formData.post_dialysis_bp}
          onChange={(e) => handleInputChange('post_dialysis_bp', e.target.value)}
        />
        {formErrors.post_dialysis_bp && <span className="error">{formErrors.post_dialysis_bp}</span>}
      </div>
      <div className="form-group">
        <label>Heart Rate (bpm):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter heart rate"
          value={formData.heart_rate}
          onChange={(e) => handleInputChange('heart_rate', e.target.value)}
        />
        {formErrors.heart_rate && <span className="error">{formErrors.heart_rate}</span>}
      </div>
      <div className="form-group">
        <label>Creatinine (mg/dL):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter creatinine"
          value={formData.creatinine}
          onChange={(e) => handleInputChange('creatinine', e.target.value)}
        />
        {formErrors.creatinine && <span className="error">{formErrors.creatinine}</span>}
      </div>
      <div className="form-group">
        <label>Urea (mg/dL):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter urea"
          value={formData.urea}
          onChange={(e) => handleInputChange('urea', e.target.value)}
        />
        {formErrors.urea && <span className="error">{formErrors.urea}</span>}
      </div>
      <div className="form-group">
        <label>Potassium (mEq/L):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter potassium"
          value={formData.potassium}
          onChange={(e) => handleInputChange('potassium', e.target.value)}
        />
        {formErrors.potassium && <span className="error">{formErrors.potassium}</span>}
      </div>
      <div className="form-group">
        <label>Hemoglobin (g/dL):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter hemoglobin"
          value={formData.hemoglobin}
          onChange={(e) => handleInputChange('hemoglobin', e.target.value)}
        />
        {formErrors.hemoglobin && <span className="error">{formErrors.hemoglobin}</span>}
      </div>
      <div className="form-group">
        <label>Hematocrit (%):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter hematocrit"
          value={formData.hematocrit}
          onChange={(e) => handleInputChange('hematocrit', e.target.value)}
        />
        {formErrors.hematocrit && <span className="error">{formErrors.hematocrit}</span>}
      </div>
      <div className="form-group">
        <label>Albumin (g/dL):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter albumin"
          value={formData.albumin}
          onChange={(e) => handleInputChange('albumin', e.target.value)}
        />
        {formErrors.albumin && <span className="error">{formErrors.albumin}</span>}
      </div>
      <div className="form-group">
        <label>Kt/V:</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter Kt/V"
          value={formData.kt_v}
          onChange={(e) => handleInputChange('kt_v', e.target.value)}
        />
        {formErrors.kt_v && <span className="error">{formErrors.kt_v}</span>}
      </div>
      <div className="form-group">
        <label>Urine Output (mL/day):</label>
        <input
          type="number"
          step="1"
          placeholder="Enter urine output"
          value={formData.urine_output}
          onChange={(e) => handleInputChange('urine_output', e.target.value)}
        />
        {formErrors.urine_output && <span className="error">{formErrors.urine_output}</span>}
      </div>
      <div className="form-group">
        <label>Dry Weight (kg):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter dry weight"
          value={formData.dry_weight}
          onChange={(e) => handleInputChange('dry_weight', e.target.value)}
        />
        {formErrors.dry_weight && <span className="error">{formErrors.dry_weight}</span>}
      </div>
      <div className="form-group">
        <label>Fluid Removal Rate (mL/hour):</label>
        <input
          type="number"
          step="1"
          placeholder="Enter fluid removal rate"
          value={formData.fluid_removal_rate}
          onChange={(e) => handleInputChange('fluid_removal_rate', e.target.value)}
        />
        {formErrors.fluid_removal_rate && <span className="error">{formErrors.fluid_removal_rate}</span>}
      </div>
      <div className="form-group">
        <label>Dialysis Duration (hours):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter dialysis duration"
          value={formData.dialysis_duration}
          onChange={(e) => handleInputChange('dialysis_duration', e.target.value)}
        />
        {formErrors.dialysis_duration && <span className="error">{formErrors.dialysis_duration}</span>}
      </div>
      <div className="form-group">
        <label>Vascular Access Type:</label>
        <select
          value={formData.vascular_access_type}
          onChange={(e) => handleInputChange('vascular_access_type', e.target.value)}
        >
          <option value="">Select Vascular Access</option>
          <option value="Catheter">Catheter</option>
          <option value="Graft">Graft</option>
          <option value="Fistula">Fistula</option>
        </select>
        {formErrors.vascular_access_type && <span className="error">{formErrors.vascular_access_type}</span>}
      </div>
      <div className="form-group">
        <label>Dialyzer Type:</label>
        <select
          value={formData.dialyzer_type}
          onChange={(e) => handleInputChange('dialyzer_type', e.target.value)}
        >
          <option value="">Select Dialyzer Type</option>
          <option value="High">High</option>
          <option value="Low">Low</option>
        </select>
        {formErrors.dialyzer_type && <span className="error">{formErrors.dialyzer_type}</span>}
      </div>
      <div className="form-group">
        <label>Severity of Case:</label>
        <select
          value={formData.severity_of_case}
          onChange={(e) => handleInputChange('severity_of_case', e.target.value)}
        >
          <option value="">Select Severity</option>
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>
        {formErrors.severity_of_case && <span className="error">{formErrors.severity_of_case}</span>}
      </div>
      <div className="form-actions">
        <button type="submit" className="action-button">Submit</button>
        <button type="button" className="action-button cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HemodialysisForm;