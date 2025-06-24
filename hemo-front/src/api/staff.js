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
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data;
  } catch (error) {
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
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data;
  } catch (error) {
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
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data;
  } catch (error) {
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
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data;
  } catch (error) {
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
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { success: false, error: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! Status: ${response.status}` };
    }

    return data;
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete medical staff.' };
  }
};

export const updateUserProfile = async (apiBaseUrl, userId) => {
  const token = localStorage.getItem('tenant-token');

  if (!token) {
    return { success: false, error: 'No access token. Please log in again.' };
  }
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  const payload = { user_id: userId };

  try {
    const response = await api.post(`${apiBaseUrl}grant-accord/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to grant admin accord.',
    };
  }
};