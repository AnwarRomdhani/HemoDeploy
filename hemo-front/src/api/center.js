import api from './api';

export const getCenterDetails = async (apiBaseUrl, token) => {
  ;
  try {
    const response = await api.get(`${apiBaseUrl}center-details/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    ;
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Center details error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch center details.' };
  }
};