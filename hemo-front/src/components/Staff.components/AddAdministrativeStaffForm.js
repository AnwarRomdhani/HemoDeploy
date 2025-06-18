import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import { addAdministrativeStaff } from '../../api/staff';
import SideMenu from '../SideMenu';
import Header from '../Header';
import './FormStyles.css';

const AddAdministrativeStaffForm = () => {
  const { apiBaseUrl } = useContext(TenantContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    job_title: '',
    role: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Last Name is required.';
    if (!formData.prenom) newErrors.prenom = 'First Name is required.';
    if (!formData.cin) newErrors.cin = 'CIN is required.';
    else if (!/^\d{8}$/.test(formData.cin)) newErrors.cin = 'CIN must be exactly 8 digits.';
    if (!formData.job_title) newErrors.job_title = 'Job Title is required.';
    if (!formData.role) newErrors.role = 'Role is required.';
    if (!formData.username) newErrors.username = 'Username is required.';
    else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) newErrors.username = 'Username must be alphanumeric.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);

    if (!validateForm()) return;

    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    const result = await addAdministrativeStaff(apiBaseUrl, token, formData);
    if (result.success) {
      setSuccess('Administrative staff added successfully!');
      setTimeout(() => navigate('/home/staff/administrative'), 2000);
    } else {
      if (result.error.errors) {
        const backendErrors = {};
        Object.keys(result.error.errors).forEach((key) => {
          backendErrors[key] = result.error.errors[key][0].message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: result.error || 'Failed to add administrative staff.' });
      }
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <SideMenu />
        <div className="content-area">
          <div className="form-section">
            <div className="form-card">
              <h2 className="content-header">Add Administrative Staff</h2>
              {errors.general && <div className="error-message">{errors.general}</div>}
              {success && <div className="success-message">{success}</div>}
              <div className="form-container">
                <div className="form-group">
                  <label>Last Name (Nom)</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                  />
                  {errors.nom && <div className="error-message">{errors.nom}</div>}
                </div>
                <div className="form-group">
                  <label>First Name (Prenom)</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                  />
                  {errors.prenom && <div className="error-message">{errors.prenom}</div>}
                </div>
                <div className="form-group">
                  <label>CIN</label>
                  <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    placeholder="CIN (8 digits)"
                    required
                  />
                  {errors.cin && <div className="error-message">{errors.cin}</div>}
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    placeholder="Job Title"
                    required
                  />
                  {errors.job_title && <div className="error-message">{errors.job_title}</div>}
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="LOCAL_ADMIN">Local Admin</option>
                    <option value="SUBMITTER">Submitter</option>
                    <option value="MEDICAL_PARA_STAFF">Medical & Paramedical Staff</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                  {errors.role && <div className="error-message">{errors.role}</div>}
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                  {errors.username && <div className="error-message">{errors.username}</div>}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                <div className="form-actions">
                  <button className="action-button" onClick={handleSubmit}>
                    Add Administrative Staff
                  </button>
                  <button
                    className="action-button cancel"
                    onClick={() => navigate('/home/staff/administrative')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdministrativeStaffForm;