import React, { useState } from 'react';
import { addTransmittableDisease } from '../../api/patients';
import './PatientMedicalActivity.css';

const TransmittableDiseaseForm = ({ apiBaseUrl, token, patientId, diseases, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    disease: '',
    new_disease_name: '',
    type_of_transmission: '',
    date_of_contraction: '',
  });
  const [useNewRef, setUseNewRef] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    console.log(`TransmittableDiseaseForm input change - ${field}:`, value);
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: '' });
  };

  const toggleNewRef = () => {
    setUseNewRef(!useNewRef);
    setFormData({ ...formData, disease: '', new_disease_name: '', type_of_transmission: '' });
    setFormErrors({});
    console.log('TransmittableDiseaseForm toggled useNewRef:', !useNewRef);
  };

  const validateForm = () => {
    const errors = {};
    if (!useNewRef && !formData.disease) errors.disease = 'Disease is required.';
    if (useNewRef) {
      if (!formData.new_disease_name.trim()) errors.new_disease_name = 'New disease name is required.';
      if (!formData.type_of_transmission.trim()) errors.type_of_transmission = 'Type of transmission is required.';
    }
    if (!formData.date_of_contraction) errors.date_of_contraction = 'Date is required.';
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
      date_of_contraction: formData.date_of_contraction,
    };

    console.log('TransmittableDiseaseForm formData before processing:', formData);

    if (useNewRef) {
      data.new_disease_name = formData.new_disease_name.trim();
      data.type_of_transmission = formData.type_of_transmission.trim();
      onSubmit(true);
    } else {
      const diseaseId = parseInt(formData.disease, 10);
      if (!diseaseId || isNaN(diseaseId)) {
        setFormErrors({ disease: 'Please select a valid disease.' });
        return;
      }
      data.disease = diseaseId;
      onSubmit(false);
    }

    console.log('TransmittableDiseaseForm submit data:', data);

    const result = await addTransmittableDisease(apiBaseUrl, token, patientId, data);
    if (result.success) {
      onClose();
    } else {
      const formattedErrors = {};
      if (result.error && typeof result.error === 'object') {
        Object.keys(result.error).forEach((key) => {
          formattedErrors[key] = result.error[key][0]?.message || result.error[key][0] || 'Invalid input.';
        });
      } else {
        formattedErrors.general = result.error || 'Failed to add transmittable disease.';
      }
      setFormErrors(formattedErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.general && <span className="error">{formErrors.general}</span>}
      <div className="form-group">
        <button type="button" className="action-button toggle-ref" onClick={toggleNewRef}>
          {useNewRef ? 'Select Existing Disease' : 'Add New Disease'}
        </button>
      </div>
      {useNewRef ? (
        <>
          <div className="form-group">
            <label>New Disease Name:</label>
            <input
              type="text"
              placeholder="Enter new disease name"
              value={formData.new_disease_name}
              onChange={(e) => handleInputChange('new_disease_name', e.target.value)}
            />
            {formErrors.new_disease_name && <span className="error">{formErrors.new_disease_name}</span>}
          </div>
          <div className="form-group">
            <label>Type of Transmission:</label>
            <input
              type="text"
              placeholder="Enter type of transmission (e.g., Airborne, Bloodborne)"
              value={formData.type_of_transmission}
              onChange={(e) => handleInputChange('type_of_transmission', e.target.value)}
            />
            {formErrors.type_of_transmission && <span className="error">{formErrors.type_of_transmission}</span>}
          </div>
        </>
      ) : (
        <div className="form-group">
          <label>Disease:</label>
          <select
            value={formData.disease}
            onChange={(e) => handleInputChange('disease', e.target.value)}
          >
            <option value="">Select Disease</option>
            {diseases.map((disease) => (
              <option key={disease.id} value={disease.id}>
                {disease.label_disease} ({disease.type_of_transmission})
              </option>
            ))}
          </select>
          {formErrors.disease && <span className="error">{formErrors.disease}</span>}
        </div>
      )}
      <div className="form-group">
        <label>Date of Contraction:</label>
        <input
          type="date"
          value={formData.date_of_contraction}
          onChange={(e) => handleInputChange('date_of_contraction', e.target.value)}
        />
        {formErrors.date_of_contraction && <span className="error">{formErrors.date_of_contraction}</span>}
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

export default TransmittableDiseaseForm;