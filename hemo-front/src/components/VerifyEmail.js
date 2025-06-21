import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TenantContext } from '../context/TenantContext';
import { verifyEmail } from '../api/auth';
import './VerifyEmail.css'; // Ajout du fichier CSS

const VerifyEmail = () => {
  const { apiBaseUrl, isValidSubdomain, subdomainError } = useContext(TenantContext);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { username, user_id } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!user_id) {
      setError('User ID missing. Please try logging in again.');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyEmail(apiBaseUrl, user_id, verificationCode);
      if (result.success) {
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { state: { username, verified: true } });
        }, 2000);
      } else {
        setError(result.error || '');
      }
    } catch (err) {
      setError(err.response?.data?.error || '');
    } finally {
      setLoading(false);
    }
  };

  if (isValidSubdomain === null) {
    return (
      <div className="verify-container">
        <p className="text-center muted">Loading...</p>
      </div>
    );
  }

  if (isValidSubdomain === false) {
    return (
      <div className="verify-container">
        <h2 className="error-title">Invalid Subdomain</h2>
        <p className="error-message">{subdomainError || 'This subdomain is not valid.'}</p>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <h2 className="verify-title">Verify Your Email</h2>
      <p className="verify-subtitle">
        Enter the 6-digit code sent to your email for {username || 'your account'}.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="verificationCode" className="form-label">
            Verification Code
          </label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            placeholder="123456"
            className="form-input"
            required
          />
        </div>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`submit-button ${loading ? 'disabled' : ''}`}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
