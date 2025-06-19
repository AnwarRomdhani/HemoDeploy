import api from './api';
import handleFetch from './fetchapi';

export const getAdministrativeStaff = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}administrative-staff/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching administrative staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const getMedicalStaff = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}medical-staff/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching medical staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const getParamedicalStaff = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}paramedical-staff/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching paramedical staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const getTechnicalStaff = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}technical-staff/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching technical staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const getWorkerStaff = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}worker-staff/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching worker staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const addAdministrativeStaff = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(
      `${apiBaseUrl}add-administrative-staff/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding administrative staff:', error.response?.data);
    return { success: false, error: error.response?.data?.errors || error.message };
  }
};

export const addMedicalStaff = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-medical-staff/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding medical staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const addParamedicalStaff = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-paramedical-staff/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding paramedical staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const addTechnicalStaff = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-technical-staff/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding technical staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const addWorkerStaff = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-worker-staff/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding worker staff:', error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const updateTechnicalStaff = async (apiBaseUrl, token, id, data) => {
  try {
    const url = `${apiBaseUrl}update-technical-staff/${id}/`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { error: responseData.error || `HTTP error ${response.status}: ${response.statusText}` };
    }

    return responseData;
  } catch (error) {
    return { error: error.message || 'Failed to update technical staff.' };
  }
};

export const deleteTechnicalStaff = async (apiBaseUrl, token, id) => {
  try {
    const url = `${apiBaseUrl}delete-technical-staff/${id}/`;
    console.log('DELETE Request URL:', url);
    console.log('Request Headers:', {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response Status:', response.status);

    let data;
    try {
      data = await response.json();
      console.log('Response Data:', data);
    } catch (e) {
      console.error('JSON Parsing Error:', e);
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data; // Expected: { success: true, message: ... }
  } catch (error) {
    console.error('deleteTechnicalStaff Error:', error);
    return { success: false, error: error.message || 'Failed to delete technical staff.' };
  }
};

export const updateWorkerStaff = async (apiBaseUrl, token, id, data) => {
  try {
    const url = `${apiBaseUrl}update-worker-staff/${id}/`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { error: responseData.error || `HTTP error ${response.status}: ${response.statusText}` };
    }

    return responseData;
  } catch (error) {
    return { error: error.message || 'Failed to update worker staff.' };
  }
};

export const deleteWorkerStaff = async (apiBaseUrl, token, id) => {
  try {
    const url = `${apiBaseUrl}delete-worker-staff/${id}/`;
    console.log('DELETE Request URL:', url);
    console.log('Request Headers:', {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response Status:', response.status);

    let data;
    try {
      data = await response.json();
      console.log('Response Data:', data);
    } catch (e) {
      console.error('JSON Parsing Error:', e);
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data; // Expected: { success: true, message: ... }
  } catch (error) {
    console.error('deleteWorkerStaff Error:', error);
    return { success: false, error: error.message || 'Failed to delete worker staff.' };
  }
};

export const updateAdministrativeStaff = async (apiBaseUrl, token, id, data) => {
  try {
    const url = `${apiBaseUrl}update-administrative-staff/${id}/`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { error: responseData.error || `HTTP error ${response.status}: ${response.statusText}` };
    }

    return responseData;
  } catch (error) {
    return { error: error.message || 'Failed to update administrative staff.' };
  }
};

export const deleteAdministrativeStaff = async (apiBaseUrl, token, id) => {
  try {
    const url = `${apiBaseUrl}delete-administrative-staff/${id}/`;
    console.log('DELETE Request URL:', url);
    console.log('Request Headers:', {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response Status:', response.status);

    let data;
    try {
      data = await response.json();
      console.log('Response Data:', data);
    } catch (e) {
      console.error('JSON Parsing Error:', e);
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data; // Expected: { success: true, message: ... }
  } catch (error) {
    console.error('deleteAdministrativeStaff Error:', error);
    return { success: false, error: error.message || 'Failed to delete administrative staff.' };
  }
};

export const updateParamedicalStaff = async (apiBaseUrl, token, id, data) => {
  try {
    const url = `${apiBaseUrl}update-paramedical-staff/${id}/`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { error: responseData.error || `HTTP error ${response.status}: ${response.statusText}` };
    }

    return responseData;
  } catch (error) {
    return { error: error.message || 'Failed to update paramedical staff.' };
  }
};

export const deleteParamedicalStaff = async (apiBaseUrl, token, id) => {
  try {
    const url = `${apiBaseUrl}delete-paramedical-staff/${id}/`;
    console.log('DELETE Request URL:', url);
    console.log('Request Headers:', {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response Status:', response.status);

    let data;
    try {
      data = await response.json();
      console.log('Response Data:', data);
    } catch (e) {
      console.error('JSON Parsing Error:', e);
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data; // Expected: { success: true, message: ... }
  } catch (error) {
    console.error('deleteParamedicalStaff Error:', error);
    return { success: false, error: error.message || 'Failed to delete paramedical staff.' };
  }
};

export const updateMedicalStaff = async (apiBaseUrl, token, id, data) => {
  try {
    const url = `${apiBaseUrl}update-medical-staff/${id}/`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { error: responseData.error || `HTTP error ${response.status}: ${response.statusText}` };
    }

    return responseData;
  } catch (error) {
    return { error: error.message || 'Failed to update medical staff.' };
  }
};

export const deleteMedicalStaff = async (apiBaseUrl, token, id) => {
  try {
    const url = `${apiBaseUrl}delete-medical-staff/${id}/`;
    console.log('DELETE Request URL:', url);
    console.log('Request Headers:', {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response Status:', response.status);

    let data;
    try {
      data = await response.json();
      console.log('Response Data:', data);
    } catch (e) {
      console.error('JSON Parsing Error:', e);
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data; // Expected: { success: true, message: ... }
  } catch (error) {
    console.error('deleteMedicalStaff Error:', error);
    return { success: false, error: error.message || 'Failed to delete medical staff.' };
  }
};

export const updateUserProfile = async (apiBaseUrl, userId) => {
  const token = localStorage.getItem('tenant-token');

  if (!token) {
    console.error('No token found in localStorage for updateUserProfile');
    return { success: false, error: 'No access token. Please log in again.' };
  }
  if (!userId) {
    console.error('No userId provided for updateUserProfile');
    return { success: false, error: 'User ID is required.' };
  }

  const payload = { user_id: userId };

  try {
    console.log('Sending request to grant admin accord:', { apiBaseUrl, payload, token });
    const response = await api.post(`${apiBaseUrl}grant-accord/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Grant admin accord response:', response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Grant admin accord error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to grant admin accord.',
    };
  }
};