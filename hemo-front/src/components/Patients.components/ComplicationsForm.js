import React, { useState } from 'react';
import { addComplications } from '../../api/patients';
import './PatientMedicalActivity.css';

const ComplicationsForm = ({ apiBaseUrl, token, patientId, complications, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    complication: '',
    new_complication_name: '',
    date_of_contraction: '',
    notes: '',
  });
  const [useNewRef, setUseNewRef] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    ;
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: '' });
  };

  const toggleNewRef = () => {
    setUseNewRef(!useNewRef);
    setFormData({ ...formData, complication: '', new_complication_name: '' });
    setFormErrors({});
    ;
  };

  const validateForm = () => {
    const errors = {};
    if (!useNewRef && !formData.complication) errors.complication = 'Complication is required.';
    if (useNewRef && !formData.new_complication_name.trim()) errors.new_complication_name = 'New complication name is required.';
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

    // Construct data explicitly
    let data = {
      date_of_contraction: formData.date_of_contraction,
      notes: formData.notes || '',
    };

    ;

    if (useNewRef) {
      const newName = formData.new_complication_name.trim();
      data.new_complication_name = newName;
      onSubmit(true); // Signal to refresh complications
    } else {
      const complicationId = parseInt(formData.complication, 10);
      if (!complicationId || isNaN(complicationId)) {
        setFormErrors({ complication: 'Please select a valid complication.' });
        return;
      }
      data.complication = complicationId;
      onSubmit(false);
    }

    ;

    const result = await addComplications(apiBaseUrl, token, patientId, data);
    if (result.success) {
      onClose();
    } else {
      const formattedErrors = {};
      if (result.error && typeof result.error === 'object') {
        Object.keys(result.error).forEach((key) => {
          formattedErrors[key] = result.error[key][0]?.message || result.error[key][0] || 'Invalid input.';
        });
      } else {
        formattedErrors.general = result.error || 'Failed to add complication.';
      }
      setFormErrors(formattedErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.general && <span className="error">{formErrors.general}</span>}
      <div className="form-group">
        <button type="button" className="action-button toggle-ref" onClick={toggleNewRef}>
          {useNewRef ? 'Select Existing Complication' : 'Add New Complication'}
        </button>
      </div>
      {useNewRef ? (
        <div className="form-group">
          <label>New Complication Name:</label>
          <input
            type="text"
            placeholder="Enter new complication name"
            value={formData.new_complication_name}
            onChange={(e) => handleInputChange('new_complication_name', e.target.value)}
          />
          {formErrors.new_complication_name && <span className="error">{formErrors.new_complication_name}</span>}
        </div>
      ) : (
        <div className="form-group">
          <label>Complication:</label>
          <select
            value={formData.complication}
            onChange={(e) => handleInputChange('complication', e.target.value)}
          >
            <option value="">Select Complication</option>
            {complications.map((complication) => (
              <option key={complication.id} value={complication.id}>
                {complication.label_complication}
              </option>
            ))}
          </select>
          {formErrors.complication && <span className="error">{formErrors.complication}</span>}
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

export default ComplicationsForm;