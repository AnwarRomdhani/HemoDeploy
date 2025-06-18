import React, { useState } from 'react';
import { addPatient } from '../../api/patients';
import './PatientMedicalActivity.css';

const AddPatientForm = ({ apiBaseUrl, token, cnams, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    cnam: '',
    new_cnam_number: '',
    entry_date: '',
    previously_dialysed: false,
    date_first_dia: '',
    blood_type: '',
    gender: '',
    weight: '',
    age: '',
    hypertension: false, // New field
    diabetes: false, // New field
  });
  const [useNewCnam, setUseNewCnam] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    console.log(`AddPatientForm input change - ${field}:`, value);
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: '' });
  };

  const toggleNewCnam = () => {
    setUseNewCnam(!useNewCnam);
    setFormData({ ...formData, cnam: '', new_cnam_number: '' });
    setFormErrors({});
    console.log('AddPatientForm toggled useNewCnam:', !useNewCnam);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nom.trim()) errors.nom = 'required.';
    if (!formData.prenom.trim()) errors.prenom = 'required.';
    if (!formData.cin.trim()) errors.cin = 'required.';
    if (!useNewCnam && !formData.cnam) errors.cnam = 'required.';
    if (useNewCnam && !formData.new_cnam_number.trim()) errors.new_cnam_number = 'required.';
    if (!formData.entry_date) errors.entry_date = 'required.';
    if (formData.previously_dialysed && !formData.date_first_dia) errors.date_first_dia = 'required.';
    if (!formData.previously_dialysed && formData.date_first_dia) errors.date_first_dia = 'should not be set.';
    if (formData.weight && (formData.weight <= 0 || formData.weight > 300)) errors.weight = 'must be between 0 and 300 kg.';
    if (formData.age && (formData.age < 0 || formData.age > 120)) errors.age = 'must be between 0 and 120 years.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    let data = {
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      cin: formData.cin.trim(),
      entry_date: formData.entry_date,
      previously_dialysed: formData.previously_dialysed,
      blood_type: formData.blood_type || '',
      gender: formData.gender || '',
      weight: formData.weight || '',
      age: formData.age || '',
      hypertension: formData.hypertension, // New field
      diabetes: formData.diabetes, // New field
    };

    if (formData.previously_dialysed) {
      data.date_first_dia = formData.date_first_dia;
    }

    console.log('AddPatientForm formData before processing:', formData);

    if (useNewCnam) {
      data.new_cnam_number = formData.new_cnam_number.trim();
    } else {
      const cnamId = parseInt(formData.cnam, 10);
      if (!cnamId || isNaN(cnamId)) {
        setFormErrors({ cnam: 'Please select a valid CNAM.' });
        return;
      }
      data.cnam = cnamId;
    }

    console.log('AddPatientForm submit data:', data);

    const result = await addPatient(apiBaseUrl, token, data);
    if (result.success) {
      onSubmit();
      onClose();
    } else {
      const formattedErrors = {};
      if (result.error && typeof result.error === 'object') {
        Object.keys(result.error).forEach((key) => {
          formattedErrors[key] = result.error[key][0]?.message || result.error[key][0] || 'Invalid input.';
        });
      } else {
        formattedErrors.general = result.error || 'Failed to add patient.';
      }
      setFormErrors(formattedErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.general && <span className="error">{formErrors.general}</span>}
      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          placeholder="Enter last name"
          value={formData.nom}
          onChange={(e) => handleInputChange('nom', e.target.value)}
        />
        {formErrors.nom && <span className="error">{formErrors.nom}</span>}
      </div>
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          placeholder="Enter first name"
          value={formData.prenom}
          onChange={(e) => handleInputChange('prenom', e.target.value)}
        />
        {formErrors.prenom && <span className="error">{formErrors.prenom}</span>}
      </div>
      <div className="form-group">
        <label>CIN:</label>
        <input
          type="text"
          placeholder="Enter CIN"
          value={formData.cin}
          onChange={(e) => handleInputChange('cin', e.target.value)}
        />
        {formErrors.cin && <span className="error">{formErrors.cin}</span>}
      </div>
      <div className="form-group">
        <button type="button" className="action-button toggle-ref" onClick={toggleNewCnam}>
          {useNewCnam ? 'Select Existing CNAM' : 'Add New CNAM'}
        </button>
      </div>
      {useNewCnam ? (
        <div className="form-group">
          <label>New CNAM Number:</label>
          <input
            type="text"
            placeholder="Enter new CNAM number"
            value={formData.new_cnam_number}
            onChange={(e) => handleInputChange('new_cnam_number', e.target.value)}
          />
          {formErrors.new_cnam_number && <span className="error">{formErrors.new_cnam_number}</span>}
        </div>
      ) : (
        <div className="form-group">
          <label>CNAM:</label>
          <select
            value={formData.cnam}
            onChange={(e) => handleInputChange('cnam', e.target.value)}
          >
            <option value="">Select CNAM</option>
            {cnams.map((cnam) => (
              <option key={cnam.id} value={cnam.id}>
                {cnam.number}
              </option>
            ))}
          </select>
          {formErrors.cnam && <span className="error">{formErrors.cnam}</span>}
        </div>
      )}
      <div className="form-group">
        <label>Entry Date:</label>
        <input
          type="date"
          value={formData.entry_date}
          onChange={(e) => handleInputChange('entry_date', e.target.value)}
        />
        {formErrors.entry_date && <span className="error">{formErrors.entry_date}</span>}
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.previously_dialysed}
            onChange={(e) => handleInputChange('previously_dialysed', e.target.checked)}
          />
          Previously Dialysed
        </label>
      </div>
      {formData.previously_dialysed && (
        <div className="form-group">
          <label>Date of First Dialysis:</label>
          <input
            type="date"
            value={formData.date_first_dia}
            onChange={(e) => handleInputChange('date_first_dia', e.target.value)}
          />
          {formErrors.date_first_dia && <span className="error">{formErrors.date_first_dia}</span>}
        </div>
      )}
      <div className="form-group">
        <label>Blood Type:</label>
        <select
          value={formData.blood_type}
          onChange={(e) => handleInputChange('blood_type', e.target.value)}
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        {formErrors.blood_type && <span className="error">{formErrors.blood_type}</span>}
      </div>
      <div className="form-group">
        <label>Gender:</label>
        <select
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        {formErrors.gender && <span className="error">{formErrors.gender}</span>}
      </div>
      <div className="form-group">
        <label>Weight (kg):</label>
        <input
          type="number"
          step="0.1"
          placeholder="Enter weight"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
        />
        {formErrors.weight && <span className="error">{formErrors.weight}</span>}
      </div>
      <div className="form-group">
        <label>Age (years):</label>
        <input
          type="number"
          placeholder="Enter age"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
        />
        {formErrors.age && <span className="error">{formErrors.age}</span>}
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.hypertension}
            onChange={(e) => handleInputChange('hypertension', e.target.checked)}
          />
          Hypertension
        </label>
        {formErrors.hypertension && <span className="error">{formErrors.hypertension}</span>}
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.diabetes}
            onChange={(e) => handleInputChange('diabetes', e.target.checked)}
          />
          Diabetes
        </label>
        {formErrors.diabetes && <span className="error">{formErrors.diabetes}</span>}
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

export default AddPatientForm;