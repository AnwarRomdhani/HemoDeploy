import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import { updateParamedicalStaff } from '../../api/staff';
import Header from '../Header';
import SideMenu from '../SideMenu';
import './FormStyles.css';

const EditParamedicalStaffForm = () => {
  const { apiBaseUrl } = useContext(TenantContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    qualification: '',
    role: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      const token = localStorage.getItem('tenant-token');
      if (!token) {
        setErrors({ general: 'No token found. Please log in.' });
        return;
      }
      const response = await fetch(`${apiBaseUrl}paramedical-staff/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          cin: data.cin || '',
          qualification: data.qualification || '',
          role: data.role || '',
          username: data.username || '',
          email: data.email || '',
          password: '',
        });
      } else {
        setErrors({ general: 'Failed to load staff data.' });
      }
    };
    fetchStaffData();
  }, [id, apiBaseUrl]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Last Name is required.';
    if (!formData.prenom) newErrors.prenom = 'First Name is required.';
    if (!formData.cin) newErrors.cin = 'CIN is required.';
    else if (!/^\d{8}$/.test(formData.cin)) newErrors.cin = 'CIN must be exactly 8 digits.';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required.';
    if (!formData.role) newErrors.role = 'Role is required.';
    if (!formData.username) newErrors.username = 'Username is required.';
    else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) newErrors.username = 'Username must be alphanumeric.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
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

    const result = await updateParamedicalStaff(apiBaseUrl, token, id, formData);
    if (result.success) {
      setSuccess('Paramedical staff updated successfully!');
      setTimeout(() => navigate('/home/staff/paramedical'), 2000);
    } else {
      setErrors({ general: result.error || 'Failed to update paramedical staff.' });
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
              <h2 className="content-header">Edit Paramedical Staff</h2>
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
                  <label>Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="Qualification"
                    required
                  />
                  {errors.qualification && <div className="error-message">{errors.qualification}</div>}
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
                  <label>Password (Leave blank to keep unchanged)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                <div className="form-actions">
                  <button className="action-button" onClick={handleSubmit}>
                    Update Paramedical Staff
                  </button>
                  <button
                    className="action-button cancel"
                    onClick={() => navigate('/home/staff/paramedical')}
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

export default EditParamedicalStaffForm;