import React, { useEffect, useState, useContext } from 'react';
import { TenantContext } from '../../context/TenantContext';
import { getCenterDetails } from '../../api/center';
import SideMenu from '../SideMenu';
import Header from '../Header';
import './CenterDetails.css';

const CenterDetails = () => {
  const { apiBaseUrl } = useContext(TenantContext);
  const [center, setCenter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('tenant-token');

  useEffect(() => {
    const fetchCenterDetails = async () => {
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const result = await getCenterDetails(apiBaseUrl, token);
        if (result.success) {
          setCenter(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        if (err.message !== 'Session expired. Please log in again.') {
          setError(err.message || 'Failed to fetch center details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCenterDetails();
  }, [apiBaseUrl, token]);

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="main-content">
          <SideMenu />
          <div className="content-area">
            <div className="center-details-container">
              <h2>Center Details</h2>
              <p>Loading center details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Header />
        <div className="main-content">
          <SideMenu />
          <div className="content-area">
            <div className="center-details-container">
              <h2>Center Details</h2>
              <p className="error">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="app-container">
        <Header />
        <div className="main-content">
          <SideMenu />
          <div className="content-area">
            <div className="center-details-container">
              <h2>Center Details</h2>
              <p>No center details available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <SideMenu />
        <div className="content-area">
          <div className="center-details-container">
            <h2>{center.label}</h2>
            <div className="center-info-card">
              <p><span className="label-text">Subdomain:</span> <span className="value-text">{center.sub_domain}</span></p>
              <p><span className="label-text">Address:</span> <span className="value-text">{center.adresse || 'N/A'}</span></p>
              <p><span className="label-text">Telephone:</span> <span className="value-text">{center.tel || 'N/A'}</span></p>
              <p><span className="label-text">Email:</span> <span className="value-text">{center.mail || 'N/A'}</span></p>
              <p><span className="label-text">Governorate:</span> <span className="value-text">{center.governorate?.name || 'N/A'}</span></p>
              <p><span className="label-text">Delegation:</span> <span className="value-text">{center.delegation?.name || 'N/A'}</span></p>
              <p><span className="label-text">Center Type:</span> <span className="value-text">{center.type_center || 'N/A'}</span></p>
              <p><span className="label-text">Hemodialysis Code:</span> <span className="value-text">{center.code_type_hemo || 'N/A'}</span></p>
              <p><span className="label-text">Hemodialysis Name:</span> <span className="value-text">{center.name_type_hemo || 'N/A'}</span></p>
              <p><span className="label-text">Center Code:</span> <span className="value-text">{center.center_code || 'N/A'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterDetails;