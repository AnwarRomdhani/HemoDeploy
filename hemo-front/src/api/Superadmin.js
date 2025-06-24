import api from 'axios';

export const getCenters = async (rootApiBaseUrl, params = {}) => {
  try {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      throw new Error('No super-admin-token found.');
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.label) queryParams.append('label', params.label);
    if (params.governorate_id) queryParams.append('governorate_id', params.governorate_id);
    if (params.delegation_id) queryParams.append('delegation_id', params.delegation_id);

    const cleanedRootApiBaseUrl = rootApiBaseUrl.replace(/^https:\/\/www\./, 'https://').replace(/\/+$/, '');

    const response = await api.get(`${cleanedRootApiBaseUrl}/centers/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
      params: queryParams,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error;
  }
};

export const getGovernorates = async (rootApiBaseUrl) => {
  try {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      throw new Error('No super-admin-token found.');
    }
    const response = await api.get(`${rootApiBaseUrl}governorates/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch governorates.' };
  }
};

export const getDelegations = async (rootApiBaseUrl) => {
  try {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      throw new Error('No super-admin-token found.');
    }
    const response = await api.get(`${rootApiBaseUrl}delegations/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch delegations.' };
  }
};

export const addCenter = async (rootApiBaseUrl, centerData) => {
  try {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      throw new Error('No super-admin-token found.');
    }
    const response = await api.post(`${rootApiBaseUrl}add-center/`, centerData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.response?.data?.errors || 'Failed to add center.' };
  }
};