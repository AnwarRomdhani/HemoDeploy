import api from './api';

export const getCenters = async (rootApiBaseUrl, filters = {}) => {
  console.log('Fetching centers:', { rootApiBaseUrl, filters });
  try {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      throw new Error('No super-admin-token found.');
    }

    const params = new URLSearchParams();
    if (filters.label) params.append('label', filters.label);
    if (filters.governorate_id) params.append('governorate_id', filters.governorate_id);
    if (filters.delegation_id) params.append('delegation_id', filters.delegation_id);

    // 🔧 Clean up rootApiBaseUrl if it contains a duplicated www.
    const cleanedRootApiBaseUrl = rootApiBaseUrl.replace(/^https:\/\/www\./, 'https://');

    const response = await api.get(`${cleanedRootApiBaseUrl}centers/`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    console.log('Centers response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Centers error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch centers.' };
  }
};

export const getGovernorates = async (rootApiBaseUrl) => {
  console.log('Fetching governorates:', { rootApiBaseUrl });
  try {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      throw new Error('No super-admin-token found.');
    }
    const response = await api.get(`${rootApiBaseUrl}governorates/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Governorates response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Governorates error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch governorates.' };
  }
};

export const getDelegations = async (rootApiBaseUrl) => {
  console.log('Fetching delegations:', { rootApiBaseUrl });
  try {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      throw new Error('No super-admin-token found.');
    }
    const response = await api.get(`${rootApiBaseUrl}delegations/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Delegations response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Delegations error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch delegations.' };
  }
};

export const addCenter = async (rootApiBaseUrl, centerData) => {
  console.log('Adding center:', { rootApiBaseUrl, centerData });
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
    console.log('Add center response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Add center error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || error.response?.data?.errors || 'Failed to add center.' };
  }
};