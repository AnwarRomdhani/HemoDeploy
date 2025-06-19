import api from 'axios'; // Assuming 'api' is an Axios instance; adjust if different

export const getCenters = async (rootApiBaseUrl, params = {}) => {
  console.log('Fetching centers:', { rootApiBaseUrl, params });
  try {
    const token = localStorage.getItem('super-admin-token');
    if (!token) {
      throw new Error('No super-admin-token found.');
    }

    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.label) queryParams.append('label', params.label);
    if (params.governorate_id) queryParams.append('governorate_id', params.governorate_id);
    if (params.delegation_id) queryParams.append('delegation_id', params.delegation_id);

    // Clean up rootApiBaseUrl
    const cleanedRootApiBaseUrl = rootApiBaseUrl.replace(/^https:\/\/www\./, 'https://').replace(/\/+$/, '');

    // Ensure correct endpoint URL (add leading '/api/' if needed)
    const response = await api.get(`${cleanedRootApiBaseUrl}/api/centers/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
      params: queryParams,
    });

    console.log('Centers response:', response.data);
    return response.data; // Return raw API response
  } catch (error) {
    console.error('Centers error:', error.response?.data || error.message);
    throw error.response?.data?.error || error; // Throw error for frontend to handle
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