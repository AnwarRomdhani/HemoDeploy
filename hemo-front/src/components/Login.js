import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../context/TenantContext';
import { loginTenant } from '../api/auth';
import NotFound from './NotFound';
import './Login.css';

const Login = () => {
  const { subdomain, apiBaseUrl, isValidSubdomain, subdomainError } = useContext(TenantContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log('Login Config:', { subdomain, apiBaseUrl, isValidSubdomain });

  if (isValidSubdomain === null) return <div>Loading...</div>;
  if (!isValidSubdomain) return <NotFound message={subdomainError || 'Invalid subdomain.'} />;
  if (!subdomain) return <NotFound message={`No tenant subdomain (hostname: ${window.location.hostname}).`} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!window.localStorage) {
        throw new Error('localStorage is disabled. Please enable it or use a different browser.');
      }

      console.log('Tenant login attempt:', { apiBaseUrl, username });
      const result = await loginTenant(apiBaseUrl, username, password);
      console.log('Login result:', { result });

      if (result.success) {
        const { accessToken, refreshToken, role, center } = result;
        if (!accessToken || !refreshToken) {
          throw new Error('Missing access or refresh token in response.');
        }

        try {
          localStorage.setItem('tenant-token', accessToken);
          localStorage.setItem('tenant-refresh-token', refreshToken);
          localStorage.setItem('role', role);
          localStorage.setItem('center', center);

          const storedToken = localStorage.getItem('tenant-token');
          console.log('Stored tenant tokens:', {
            token: storedToken?.slice(0, 10) + '...' || 'NOT SET',
            refreshToken: localStorage.getItem('tenant-refresh-token')?.slice(0, 10) + '...' || 'NOT SET',
            role: localStorage.getItem('role'),
            center: localStorage.getItem('center'),
            hostname: window.location.hostname,
          });

          if (!storedToken || storedToken !== accessToken) {
            throw new Error('Failed to store token in localStorage.');
          }

          setTimeout(() => {
            console.log('Navigating to /home');
            navigate('/home', { replace: true });
          }, 100);
        } catch (storageError) {
          console.error('localStorage error:', storageError);
          setError('Failed to store authentication data. Check browser settings or try a different browser.');
          return;
        }
      } else if (result.needsVerification) {
        console.log('Redirecting to /verify-email with user_id:', { user_id: result.user_id, username });
        navigate('/verify-email', { state: { username, user_id: result.user_id } });
      } else {
        console.error('Tenant login failed:', result.error);
        setError(result.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Tenant login error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.error || err.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to {subdomain}</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;