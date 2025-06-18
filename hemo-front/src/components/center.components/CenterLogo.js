import React from 'react';
import logoImage from './CenterLogo.png'; // Ensure logo.png is in src/center.components/

const CenterLogo = () => {
  return (
    <div className="logo-container">
      <img
        src={logoImage}
        alt="Center Logo"
        className="center-logo"
      />
    </div>
  );
};

export default CenterLogo;