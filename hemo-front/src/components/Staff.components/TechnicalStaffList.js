import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import { getTechnicalStaff, deleteTechnicalStaff, updateUserProfile } from '../../api/staff';
import SideMenu from '../SideMenu';
import Header from '../Header';
import './Staff.css';

const TechnicalStaffList = () => {
  const { apiBaseUrl } = useContext(TenantContext);
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const fetchData = async () => {
    setErrors({});
    setSuccess(null);
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }
    const result = await getTechnicalStaff(apiBaseUrl, token);
    if (!result?.success) {
      setErrors({ general: result?.error || 'Failed to fetch technical staff.' });
      setStaffList([]);
    } else {
      const mappedData = result.data.map(staff => ({
        id: staff.class_id,
        user_id: staff.user_id,
        nom: staff.nom,
        prenom: staff.prenom,
        cin: staff.cin,
        qualification: staff.qualification,
        role: staff.role,
        email: staff.email,
        admin_accord: staff.admin_accord
      }));
      setStaffList(mappedData);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiBaseUrl]);

  const handleDelete = async (id, nom, prenom) => {
    if (!window.confirm(`Are you sure you want to delete ${nom} ${prenom}?`)) return;

    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    try {
      const result = await deleteTechnicalStaff(apiBaseUrl, token, id);

      if (result && typeof result === 'object' && result.success) {
        setSuccess('Technical staff deleted successfully!');
        fetchData();
        setTimeout(() => setSuccess(null), 2000);
      } else {
        const errorMsg = result?.error || 'Failed to delete technical staff: Invalid response format.';
        setErrors({ general: errorMsg });
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to delete technical staff.';
      setErrors({ general: errorMsg });
    }
  };

  const handleGrantAccord = async (userId, nom, prenom) => {
    if (!window.confirm(`Grant admin accord to ${nom} ${prenom}?`)) return;

    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    try {
      const result = await updateUserProfile(apiBaseUrl, userId);

      if (result && typeof result === 'object' && result.success) {
        setSuccess(`Admin accord granted to ${nom} ${prenom}!`);
        fetchData();
        setTimeout(() => setSuccess(null), 2000);
      } else {
        const errorMsg = result?.error || 'Failed to grant admin accord: Invalid response format.';
        setErrors({ general: errorMsg });
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to grant admin accord.';
      setErrors({ general: errorMsg });
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <SideMenu />
        <div className="content-area">
          <h2 className="content-header">Technical Staff List</h2>
          <div className="staff-section">
            {errors.general && <div className="error-message">{errors.general}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="content-header">
              <h3>Staff Overview</h3>
              <div className="action-buttons">
                <button
                  className="action-button"
                  onClick={() => navigate('/home/staff/technical/add')}
                >
                  Add Technical Staff
                </button>
              </div>
            </div>
            {staffList.length === 0 ? (
              <p className="no-data">No technical staff found.</p>
            ) : (
              <div className="table-wrapper">
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User ID</th>
                      <th>Last Name</th>
                      <th>First Name</th>
                      <th>CIN</th>
                      <th>Qualification</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Admin Accord</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((staff) => (
                      <tr key={staff.id}>
                        <td>{staff.id}</td>
                        <td>{staff.user_id}</td>
                        <td>{staff.nom}</td>
                        <td>{staff.prenom}</td>
                        <td>{staff.cin}</td>
                        <td>{staff.qualification}</td>
                        <td>{staff.role}</td>
                        <td>{staff.email}</td>
                        <td>{staff.admin_accord ? 'Yes' : 'No'}</td>
                        <td>
                          <button
                            className="action-button small"
                            onClick={() => navigate(`/home/staff/technical/edit/${staff.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-button small danger"
                            onClick={() => handleDelete(staff.id, staff.nom, staff.prenom)}
                          >
                            Delete
                          </button>
                          {!staff.admin_accord && (
                            <button
                              className="action-button small primary"
                              onClick={() => handleGrantAccord(staff.user_id, staff.nom, staff.prenom)}
                            >
                              Grant Accord
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalStaffList;
