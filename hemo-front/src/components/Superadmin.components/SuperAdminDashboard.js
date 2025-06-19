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
  const [filters, setFilters] = useState({
    label: '',
    governorate_id: '',
    delegation_id: '',
  });

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
          ...(filters.label && { label: filters.label }),
          ...(filters.governorate_id && { governorate_id: filters.governorate_id }),
          ...(filters.delegation_id && { delegation_id: filters.delegation_id }),
        };
        const response = await getCenters(rootApiBaseUrl, params);
        console.log('Centers API response:', response);

        if (response.success || response.data?.success) {
          const data = response.data;

          // Handle various potential backend formats
          if (Array.isArray(data)) {
            setCenters(data);
          } else if (Array.isArray(data?.results?.data)) {
            setCenters(data.results.data);
            setTotalPages(Math.ceil(data.count / 10));
          } else if (Array.isArray(data?.data)) {
            setCenters(data.data);
            setTotalPages(1);
          } else {
            console.error('Unexpected format for centers response:', data);
            setCenters([]);
          }
        } else {
          setError(response.error || 'Failed to fetch centers');
        }
      } catch (err) {
        setError('Failed to fetch centers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, [navigate, rootApiBaseUrl, currentPage, filters]);

  const handleAddCenter = () => navigate('/superadmin/add-center');

  const handleLogout = () => {
    localStorage.removeItem('isSuperAdmin');
    localStorage.removeItem('superAdminUsername');
    localStorage.removeItem('super-admin-token');
    localStorage.removeItem('super-admin-refresh-token');
    navigate('/superadmin/login', { replace: true });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const getPaginationRange = () => {
    const range = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    if (currentPage === 1) endPage = Math.min(totalPages, 3);
    else if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);
    for (let i = startPage; i <= endPage; i++) range.push(i);
    return range;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      <div className="filters-section">
        <input
          type="text"
          name="label"
          placeholder="Filter by label"
          value={filters.label}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="governorate_id"
          placeholder="Filter by governorate ID"
          value={filters.governorate_id}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="delegation_id"
          placeholder="Filter by delegation ID"
          value={filters.delegation_id}
          onChange={handleFilterChange}
          className="filter-input"
        />
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
                {getPaginationRange().map((number) => (
                  <button
                    key={number}
                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
