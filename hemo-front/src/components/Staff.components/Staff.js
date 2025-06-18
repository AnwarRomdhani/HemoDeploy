import React from 'react';
import './Staff.css';

const Staff = () => {
  return (
    <div className="section-container">
      <div className="section-card">
        <h2>Staff Management</h2>
        <p>View and manage administrative, medical, paramedical, technical, and worker staff.</p>
        <button className="action-button">Add Staff</button>
      </div>
    </div>
  );
};

export default Staff;