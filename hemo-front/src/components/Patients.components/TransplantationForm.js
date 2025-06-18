import React, { useState } from 'react';
import { addTransplantation } from '../../api/patients';
import './PatientMedicalActivity.css';

const TransplantationForm = ({ apiBaseUrl, token, patientId, transplantations, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    transplantation: '',
    new_transplantation_name: '',
    date_operation: '',
    notes: '',
  });
  const [useNewRef, setUseNewRef] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    console.log(`TransplantationForm input change - ${field}:`, value);
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: '' });
  };

  const toggleNewRef = () => {
    setUseNewRef(!useNewRef);
    setFormData({ ...formData, transplantation: '', new_transplantation_name: '' });
    setFormErrors({});
    console.log('TransplantationForm toggled useNewRef:', !useNewRef);
  };

  const validateForm = () => {
    const errors = {};
    if (!useNewRef && !formData.transplantation) errors.transplantation = 'Transplantation type is required.';
    if (useNewRef && !formData.new_transplantation_name.trim()) errors.new_transplantation_name = 'New transplantation name is required.';
    if (!formData.date_operation) errors.date_operation = 'Date is required.';
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
      date_operation: formData.date_operation,
      notes: formData.notes || '',
    };

    console.log('TransplantationForm formData before processing:', formData);

    if (useNewRef) {
      data.new_transplantation_name = formData.new_transplantation_name.trim();
      onSubmit(true);
    } else {
      const transplantationId = parseInt(formData.transplantation, 10);
      if (!transplantationId || isNaN(transplantationId)) {
        setFormErrors({ transplantation: 'Please select a valid transplantation.' });
        return;
      }
      data.transplantation = transplantationId;
      onSubmit(false);
    }

    console.log('TransplantationForm submit data:', data);

    const result = await addTransplantation(apiBaseUrl, token, patientId, data);
    if (result.success) {
      onClose();
    } else {
      const formattedErrors = {};
      if (result.error && typeof result.error === 'object') {
        Object.keys(result.error).forEach((key) => {
          formattedErrors[key] = result.error[key][0]?.message || result.error[key][0] || 'Invalid input.';
        });
      } else {
        formattedErrors.general = result.error || 'Failed to add transplantation.';
      }
      setFormErrors(formattedErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.general && <span className="error">{formErrors.general}</span>}
      <div className="form-group">
        <button type="button" className="action-button toggle-ref" onClick={toggleNewRef}>
          {useNewRef ? 'Select Existing Transplantation' : 'Add New Transplantation'}
        </button>
      </div>
      {useNewRef ? (
        <div className="form-group">
          <label>New Transplantation Name:</label>
          <input
            type="text"
            placeholder="Enter new transplantation name"
            value={formData.new_transplantation_name}
            onChange={(e) => handleInputChange('new_transplantation_name', e.target.value)}
          />
          {formErrors.new_transplantation_name && <span className="error">{formErrors.new_transplantation_name}</span>}
        </div>
      ) : (
        <div className="form-group">
          <label>Transplantation:</label>
          <select
            value={formData.transplantation}
            onChange={(e) => handleInputChange('transplantation', e.target.value)}
          >
            <option value="">Select Transplantation</option>
            {transplantations.map((transplantation) => (
              <option key={transplantation.id} value={transplantation.id}>
                {transplantation.label_transplantation}
              </option>
            ))}
          </select>
          {formErrors.transplantation && <span className="error">{formErrors.transplantation}</span>}
        </div>
      )}
      <div className="form-group">
        <label>Date of Operation:</label>
        <input
          type="date"
          value={formData.date_operation}
          onChange={(e) => handleInputChange('date_operation', e.target.value)}
        />
        {formErrors.date_operation && <span className="error">{formErrors.date_operation}</span>}
      </div>
      <div className="form-group">
        <label>Notes:</label>
        <textarea
          placeholder="Enter notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
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

export default TransplantationForm;