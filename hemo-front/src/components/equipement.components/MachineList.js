import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import SideMenu from '../SideMenu';
import Header from '../Header';
import './MachineList.css';

const MachineList = () => {
  const { apiBaseUrl } = useContext(TenantContext);
  const navigate = useNavigate();
  const [machineList, setMachineList] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    try {
      const response = await axios.get(`${apiBaseUrl}machines/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMachineList(response.data);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Failed to fetch machines.' });
      setMachineList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiBaseUrl]);

  const handleDelete = async (id, brand) => {
    if (!window.confirm(`Are you sure you want to delete machine ${brand}?`)) return;

    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    try {
      await axios.delete(`${apiBaseUrl}machines/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Machine deleted successfully!');
      fetchData(); // Refresh the list
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Failed to delete machine.' });
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <SideMenu />
        <div className="content-area">
          <h2 className="content-header">Machine List</h2>
          <div className="machine-section">
            {errors.general && <div className="error-message">{errors.general}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="content-header">
              <h3>Machine Inventory</h3>
              <div className="action-buttons">
                <button
                  className="action-button"
                  onClick={() => navigate('/home/equipment/add')}
                >
                  Add Machine
                </button>
              </div>
            </div>
            {machineList.length === 0 ? (
              <p className="no-data">No machines found.</p>
            ) : (
              <div className="table-wrapper">
                <table className="machine-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Brand</th>
                      <th>Functional</th>
                      <th>Reserve</th>
                      <th>Refurbished</th>
                      <th>Hours</th>
                      <th>Membrane</th>
                      <th>Filtre</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machineList.map((machine) => (
                      <tr key={machine.id}>
                        <td>{machine.id}</td>
                        <td>{machine.brand}</td>
                        <td>{machine.functional ? 'Yes' : 'No'}</td>
                        <td>{machine.reserve ? 'Yes' : 'No'}</td>
                        <td>{machine.refurbished ? 'Yes' : 'No'}</td>
                        <td>{machine.nbre_hrs}</td>
                        <td>{machine.membrane ? machine.membrane.type : 'N/A'}</td>
                        <td>{machine.filtre ? `${machine.filtre.type} (${machine.filtre.sterilisation || 'N/A'})` : 'N/A'}</td>
                        <td>
                          <button
                            className="action-button small"
                            onClick={() => navigate(`/home/equipment/edit/${machine.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-button small danger"
                            onClick={() => handleDelete(machine.id, machine.brand)}
                          >
                            Delete
                          </button>
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

export default MachineList;