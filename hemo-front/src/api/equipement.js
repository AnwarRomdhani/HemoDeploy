import api from './api';

export const getMachines = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}machines/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error('Error fetching machines:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const getMembranes = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}membranes/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error('Error fetching membranes:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const getFiltres = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}filtres/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error('Error fetching filtres:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const addMachine = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-machine/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding machine:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.response?.data?.errors || error.message };
  }
};

export const addFiltre = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-filtre/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding Filtre:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.response?.data?.errors || error.message };
  }
};

export const addMembrane = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-membrane/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding Membrane:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.response?.data?.errors || error.message };
  }
};