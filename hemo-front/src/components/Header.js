import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../context/TenantContext';
import { useUserApi } from '../api/user';
import CenterLogo from './center.components/CenterLogo.js';
import User from './User.png';
import './Header.css';

const Header = () => {
  const { subdomain } = useContext(TenantContext);
  const { fetchUserDetails } = useUserApi();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    role: localStorage.getItem('role') || 'User',
    center: localStorage.getItem('center') || subdomain,
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      const token = localStorage.getItem('tenant-token');
      if (!token) {
        console.warn('No tenant-token found for header user info');
        return;
      }
      try {
        const result = await fetchUserDetails();
        if (result.success) {
          setUserInfo({
            role: result.data.role || 'User',
            center: result.data.center?.label || subdomain,
          });
          localStorage.setItem('role', result.data.role || 'User');
          localStorage.setItem('center', result.data.center?.label || subdomain);
        }
      } catch (err) {
        console.error('Failed to load user info for header:', err);
      }
    };
    loadUserInfo();
  }, [fetchUserDetails, subdomain]);

  const handleLogout = () => {
    console.log('Logging out:', { subdomain });
    localStorage.removeItem('tenant-token');
    localStorage.removeItem('role');
    localStorage.removeItem('center');
    navigate('/login');
  };

  const handleUserProfile = () => {
    console.log('Navigating to User Profile');
    navigate('/home/user-profile');
  };

  return (
    <div className="header">
      <div className="header-left">
        <CenterLogo />
        <div className="header-text">
          <h1>Welcome to {userInfo.center}</h1>
          <p>{userInfo.role}</p>
        </div>
      </div>
      <div className="header-right">
        <img src={User} alt="User Profile" className="user-icon" onClick={handleUserProfile} />
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;