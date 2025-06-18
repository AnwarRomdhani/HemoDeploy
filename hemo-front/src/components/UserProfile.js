import React, { useState, useEffect, useContext } from 'react';
import { TenantContext } from '../context/TenantContext';
import { useUserApi } from '../api/user';
import Header from './Header';
import SideMenu from './SideMenu';
import './Staff.components/FormStyles.css';

const UserProfile = () => {
  const { isValidSubdomain, subdomainError } = useContext(TenantContext);
  const { fetchUserDetails } = useUserApi();
  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserDetails = async () => {
      setErrors({});
      if (!isValidSubdomain) {
        setErrors({ general: subdomainError || 'Invalid tenant subdomain' });
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('tenant-token');
      if (!token) {
        setErrors({ general: 'No token found. Please log in.' });
        setLoading(false);
        return;
      }

      try {
        const result = await fetchUserDetails();
        console.log('fetchUserDetails result:', result);
        if (result.success) {
          setUserData(result.data);
        } else {
          setErrors({ general: result.error || 'Failed to load user details' });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error in getUserDetails:', err);
        setErrors({ general: 'Failed to load user details due to an error' });
        setLoading(false);
      }
    };
    getUserDetails();
  }, [isValidSubdomain, subdomainError, fetchUserDetails]);

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="main-content">
          <SideMenu />
          <div className="content-area">
            <div className="loading">Loading...</div>
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
          <div className="form-section">
            <div className="form-card">
              <h2 className="content-header">User Profile</h2>
              {errors.general && <div className="error-message">{errors.general}</div>}
              {userData && (
                <div className="form-container">
                  <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={userData.username} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="text" value={userData.email} readOnly />
                  </div>
                  {userData.is_superuser ? (
                    <div className="form-group">
                      <label>Role</label>
                      <input type="text" value="Super Admin" readOnly />
                    </div>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Role</label>
                        <input type="text" value={userData.role || 'No Role Assigned'} readOnly />
                      </div>
                      {userData.center && (
                        <div className="form-group">
                          <label>Center</label>
                          <input type="text" value={`${userData.center.label} (${userData.center.sub_domain})`} readOnly />
                        </div>
                      )}
                      {userData.staff_details && (
                        <>
                          <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={`${userData.staff_details.prenom} ${userData.staff_details.nom}`} readOnly />
                          </div>
                          <div className="form-group">
                            <label>CIN</label>
                            <input type="text" value={userData.staff_details.cin} readOnly />
                          </div>
                          <div className="form-group">
                            <label>Phone</label>
                            <input type="text" value={userData.staff_details.tel || 'N/A'} readOnly />
                          </div>
                        </>
                      )}
                      <div className="form-group">
                        <label>Verified</label>
                        <input type="text" value={userData.profile.is_verified ? 'Yes' : 'No'} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Has Role Privileges</label>
                        <input type="text" value={userData.profile.has_role_privileges ? 'Yes' : 'No'} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Admin Accord</label>
                        <input type="text" value={userData.profile.admin_accord ? 'Yes' : 'No'} readOnly />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;