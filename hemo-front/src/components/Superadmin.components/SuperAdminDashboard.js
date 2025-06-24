import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCenters } from '../../api/Superadmin';
import { TenantContext } from '../../context/TenantContext';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { rootApiBaseUrl } = useContext(TenantContext);
  const [username, setUsername] = useState('');
  const [centers, setCenters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
    const storedUsername = localStorage.getItem('superAdminUsername');
    const token = localStorage.getItem('super-admin-token');
    if (!isSuperAdmin || !storedUsername || !token) {
      navigate('/superadmin/login', { replace: true });
      return;
    }
    setUsername(storedUsername);

    const fetchCenters = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          page_size: 10,
        };
        const response = await getCenters(rootApiBaseUrl, params);

        if (response?.results?.success && Array.isArray(response.results.data)) {
          setCenters(response.results.data);
          setTotalPages(Math.ceil(response.count / params.page_size) || 1);
        } else {
          setError('Failed to load centers. Unexpected data format.');
          setCenters([]);
          setTotalPages(1);
        }
      } catch (err) {
        const errorMessage = err.error || err.message || 'Unknown error';
        setError(`Failed to fetch centers: ${errorMessage}`);
        setCenters([]);
        
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, [navigate, rootApiBaseUrl, currentPage]);

  const handleAddCenter = () => navigate('/superadmin/add-center');

  const handleLogout = () => {
    localStorage.removeItem('isSuperAdmin');
    localStorage.removeItem('superAdminUsername');
    localStorage.removeItem('super-admin-token');
    localStorage.removeItem('super-admin-refresh-token');
    navigate('/superadmin/login', { replace: true });
  };

  const getPaginationRange = () => {
    const range = [];
    const maxButtons = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons && startPage > 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Superadmin Dashboard</h1>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {username}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="manage-controls">
        <h2 className="section-title">Manage Centers</h2>
        <button className="btn-add-center" onClick={handleAddCenter}>Add New Center</button>
      </div>

      <main className="main-content">
        <div className="centers-section">
          <h3 className="subsection-title">Centers</h3>
          {loading ? (
            <div className="loading-text">Loading centers...</div>
          ) : centers.length === 0 ? (
            <div className="no-centers">No centers found.</div>
          ) : (
            <>
              <div className="centers-table-container">
                <table className="centers-table">
                  <thead>
                    <tr>
                      <th>Subdomain</th>
                      <th>Label</th>
                      <th>Governorate</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {centers.map((center) => (
                      <tr key={center.id}>
                        <td>{center.sub_domain}</td>
                        <td>{center.label}</td>
                        <td>{center.governorate?.label || 'N/A'}</td>
                        <td>{center.type_center}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                {getPaginationRange().map((number) => (
                  <button
                    key={number}
                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
