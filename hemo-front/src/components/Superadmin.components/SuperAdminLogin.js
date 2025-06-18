import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSuperAdmin } from '../../api/auth';

const SuperAdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Superadmin login attempt:', { username });
      const result = await loginSuperAdmin(username, password);
      console.log('Login result:', result);

      if (result.success) {
        localStorage.setItem('super-admin-token', result.data.access_token);
        localStorage.setItem('super-admin-refresh-token', result.data.refresh_token);
        localStorage.setItem('isSuperAdmin', 'true');
        localStorage.setItem('superAdminUsername', result.data.user.username);
        console.log('Stored superadmin data:', {
          token: localStorage.getItem('super-admin-token').slice(0, 10) + '...',
          isSuperAdmin: localStorage.getItem('isSuperAdmin'),
          username: localStorage.getItem('superAdminUsername'),
        });
        navigate('/superadmin/dashboard', { replace: true });
      } else {
        console.error('Superadmin login failed:', result.error);
        setError(result.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Superadmin login error:', err.message);
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="login-container">
      <div className="login-box">
        <h2>Superadmin Login</h2>
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

export default SuperAdminLogin;