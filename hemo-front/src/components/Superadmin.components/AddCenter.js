import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import { getGovernorates, getDelegations, addCenter } from '../../api/Superadmin';
import './AddCenter.css';

const AddCenter = () => {
  const { rootApiBaseUrl } = useContext(TenantContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sub_domain: '',
    label: '',
    tel: '',
    mail: '',
    adresse: '',
    governorate: '',
    delegation: '',
    type_center: '',
    code_type_hemo: '',
    name_type_hemo: '',
    center_code: '',
  });
  const [governorates, setGovernorates] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      ;
      navigate('/superadmin/login', { replace: true });
      return;
    }

    const fetchGovernorates = async () => {
      try {
        ;
        const response = await getGovernorates(rootApiBaseUrl);
        if (response.success) {
          setGovernorates(response.data.data || []);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to fetch governorates.');
        console.error('Governorates error:', err.message, err.response?.data);
      }
    };
    fetchGovernorates();
  }, [rootApiBaseUrl, navigate]);

  useEffect(() => {
    if (formData.governorate) {
      const fetchDelegations = async () => {
        try {
          ;
          const response = await getDelegations(rootApiBaseUrl);
          if (response.success) {
            const filteredDelegations = response.data.data.filter(
              (del) => del.governorate === parseInt(formData.governorate)
            );
            setDelegations(filteredDelegations);
          } else {
            setError(response.error);
          }
        } catch (err) {
          setError('Failed to fetch delegations.');
          console.error('Delegations error:', err.message, err.response?.data);
        }
      };
      fetchDelegations();
    } else {
      setDelegations([]);
    }
  }, [formData.governorate, rootApiBaseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      ;
      const response = await addCenter(rootApiBaseUrl, {
        ...formData,
        governorate: formData.governorate ? parseInt(formData.governorate) : null,
        delegation: formData.delegation ? parseInt(formData.delegation) : null,
        center_code: formData.center_code ? parseInt(formData.center_code) : null,
      });
      if (response.success) {
        setSuccess('Center added successfully!');
        setFormData({
          sub_domain: '',
          label: '',
          tel: '',
          mail: '',
          adresse: '',
          governorate: '',
          delegation: '',
          type_center: '',
          code_type_hemo: '',
          name_type_hemo: '',
          center_code: '',
        });
        setTimeout(() => navigate('/superadmin/dashboard'), 2000);
      } else {
        setError(response.error);
        console.error('Add center error:', response.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add center.');
      console.error('Add center error:', err.message, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const centerTypes = [
    'CIRCONSCRIPTION',
    'REGIONAL',
    'UNIVERSITY',
    'BASIC',
    'PRIVATE',
  ];
  const codeTypeHemoOptions = ['MD2200', 'UNITE', 'UNITEP'];
  const nameTypeHemoOptions = [
    'SERVICE HEMODIALYSE',
    'UNITE HEMODIALYSE',
    'UNITE HEMODIALYSE PEDIATRIQUE',
  ];

  return (
    <div className="add-center-container">
      <div className="add-center-box">
        <h2 className="add-center-title">Add New Center</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit} className="add-center-form">
          <div className="form-group">
            <label htmlFor="sub_domain">Subdomain</label>
            <input
              type="text"
              id="sub_domain"
              name="sub_domain"
              value={formData.sub_domain}
              onChange={handleChange}
              placeholder="e.g., tunis-center"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="label">Label</label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="e.g., Tunis Hospital"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tel">Telephone</label>
            <input
              type="text"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              placeholder="e.g., +216 71 123 456"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mail">Email</label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              placeholder="e.g., contact@tunishospital.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="adresse">Address</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="e.g., 123 Main St, Tunis"
            />
          </div>
          <div className="form-group">
            <label htmlFor="governorate">Governorate</label>
            <select
              id="governorate"
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              required
            >
              <option value="">Select Governorate</option>
              {governorates.map((gov) => (
                <option key={gov.id} value={gov.id}>
                  {gov.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="delegation">Delegation</label>
            <select
              id="delegation"
              name="delegation"
              value={formData.delegation}
              onChange={handleChange}
            >
              <option value="">Select Delegation</option>
              {delegations.map((del) => (
                <option key={del.id} value={del.id}>
                  {del.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="type_center">Center Type</label>
            <select
              id="type_center"
              name="type_center"
              value={formData.type_center}
              onChange={handleChange}
              required
            >
              <option value="">Select Center Type</option>
              {centerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="code_type_hemo">Code Type Hemo</label>
            <select
              id="code_type_hemo"
              name="code_type_hemo"
              value={formData.code_type_hemo}
              onChange={handleChange}
            >
              <option value="">Select Code Type Hemo</option>
              {codeTypeHemoOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name_type_hemo">Name Type Hemo</label>
            <select
              id="name_type_hemo"
              name="name_type_hemo"
              value={formData.name_type_hemo}
              onChange={handleChange}
            >
              <option value="">Select Name Type Hemo</option>
              {nameTypeHemoOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="center_code">Center Code</label>
            <input
              type="number"
              id="center_code"
              name="center_code"
              value={formData.center_code}
              onChange={handleChange}
              placeholder="e.g., 1001"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Adding Center...' : 'Add Center'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCenter;