import axios from 'axios';
import { TenantContext } from '../context/TenantContext';
import { useContext } from 'react';

export const useReportService = () => {
  const { apiBaseUrl } = useContext(TenantContext);

  const downloadReport = async () => {
    try {
      const token = localStorage.getItem('tenant-token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.get(`${apiBaseUrl}export-pdf/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Handle binary PDF data
      });

      // Create a blob URL for the PDF
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from Content-Disposition header or set default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `center_report_${new Date().toISOString().split('T')[0]}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Report downloaded successfully.' };
    } catch (err) {
      console.error('Error downloading PDF:', err);
      const errorMessage =
        err.response?.status === 404
          ? 'No center found for this subdomain.'
          : err.response?.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.message || 'Failed to download report.';
      throw new Error(errorMessage);
    }
  };

  return { downloadReport };
};