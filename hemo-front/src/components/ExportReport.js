import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReportService } from '../api/report';
import './ExportReport.css';

const ExportReport = () => {
  const { downloadReport } = useReportService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initiateDownload = async () => {
      try {
        const { message } = await downloadReport();
        alert(message);
        setTimeout(() => navigate('/home/patients'), 1000);
      } catch (err) {
        if (err.message !== 'Session expired. Please log in again.') {
          setError(err.message);
          alert(err.message);
          setLoading(false);
        }
      }
    };

    initiateDownload();
  }, [downloadReport, navigate]);

  if (loading) {
    return (
      <div className="export-report-container">
        <h2>Generating Report</h2>
        <p>Please wait while the report is being generated...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="export-report-container">
        <h2>Error</h2>
        <p className="error">{error}</p>
        <button onClick={() => navigate('/home/patients')}>Back to Dashboard</button>
      </div>
    );
  }

  return null;
};

export default ExportReport;