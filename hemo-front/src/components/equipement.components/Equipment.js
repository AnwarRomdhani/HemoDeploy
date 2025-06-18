import React, { useContext, useEffect } from 'react';
import { TenantContext } from '../../context/TenantContext';
import './Equipment.css';

const Equipment = () => {
  const { subdomain } = useContext(TenantContext);

  useEffect(() => {
    console.log('Equipment.js loaded:', {
      subdomain,
      accessToken: !!localStorage.getItem('tenant-token'),
      role: localStorage.getItem('role'),
    });
  }, [subdomain]);

  return (
    <div className="section-container">
      <div className="section-card">
        <h2>Equipment Inventory ({subdomain})</h2>
        <p>Track and manage medical equipment.</p>
        <button className="action-button">Add Equipment</button>
      </div>
    </div>
  );
};

export default Equipment;