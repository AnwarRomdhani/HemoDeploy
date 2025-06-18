import api from './api';
import { useContext, useCallback } from 'react';
import { TenantContext } from '../context/TenantContext';

export const useUserApi = () => {
  const { apiBaseUrl, isValidSubdomain, subdomainError } = useContext(TenantContext);

  const fetchUserDetails = useCallback(async () => {
    if (!isValidSubdomain) {
      console.error('Invalid subdomain:', subdomainError);
      return { success: false, error: subdomainError || 'Invalid tenant subdomain' };
    }

    const token = localStorage.getItem('tenant-token');
    if (!token) {
      console.error('No tenant-token found in localStorage');
      return { success: false, error: 'No token found. Please log in.' };
    }

    try {
      const response = await api.get(`${apiBaseUrl}user/details/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('User details response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching user details:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user details',
      };
    }
  }, [apiBaseUrl, isValidSubdomain, subdomainError]);

  return { fetchUserDetails };
};