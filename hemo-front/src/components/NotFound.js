import React from 'react';

const NotFound = ({ message = 'Page not found.' }) => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Error</h2>
        <div className="error">{message}</div>
      </div>
    </div>
  );
};

export default NotFound;