import axios from 'axios';
import api from './api';
import { getTenantConfig } from '../utils/tenant';


export const checkSubdomain = async (rootApiBaseUrl, subdomain) => {
  ;
  try {
    const response = await axios.get(`${rootApiBaseUrl}check-subdomain/`, {
      params: { subdomain },
      headers: { 'Content-Type': 'application/json' },
    });
    ;
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Check subdomain error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, error: error.response?.data?.error || 'Invalid subdomain.' };
  }
};

export const loginTenant = async (apiBaseUrl, username, password) => {
  ;
  try {
    const response = await api.post(`${apiBaseUrl}login/`, { username, password }, {
      headers: { 'Content-Type': 'application/json' },
    });
    ;

    if (!response.data.access || !response.data.refresh) {
      throw new Error('Missing access or refresh token in response.');
    }

    return {
      success: true,
      accessToken: response.data.access,
      refreshToken: response.data.refresh,
      role: response.data.role || 'AdministrativeStaff',
      center: response.data.center || 'cilo',
    };
  } catch (error) {
    console.error('Tenant login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    if (error.response?.status === 403 && error.response?.data?.error === 'Email verification required.') {
      ;
      return {
        success: false,
        needsVerification: true,
        user_id: error.response.data.user_id,
        error: error.response.data.error,
      };
    }
    return { success: false, error: error.response?.data?.error || 'Failed to login.' };
  }
};

export const loginSuperAdmin = async (username, password) => {
  try {
    const { rootApiBaseUrl } = getTenantConfig();
    const cleanedRootApiBaseUrl = rootApiBaseUrl.replace(/^https:\/\/www\./, 'https://');
    const response = await api.post(`${cleanedRootApiBaseUrl}superadmin-login/`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Superadmin login error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to login.' };
  }
};

export const getUserProfile = async (apiBaseUrl, token) => {
  ;
  try {
    const response = await api.get(`${apiBaseUrl}user-profile/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    ;
    return { success: true, data: response.data };
  } catch (error) {
    console.error('User profile error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, error: error.response?.data?.error || 'Failed to fetch user profile.' };
  }
};

export const verifyEmail = async (apiBaseUrl, userId, verificationCode) => {
  ;
  try {
    const response = await api.post(
      `${apiBaseUrl}verify-user/`,
      { user_id: userId, verification_code: verificationCode },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    ;
    return response.data;
  } catch (error) {
    console.error('Verification error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error.response?.data || { error: 'An error occurred during verification.' };
  }
};

export const logout = () => {
  localStorage.removeItem('tenant-token');
  localStorage.removeItem('tenant-refresh-token');
  localStorage.removeItem('role');
  localStorage.removeItem('center');
  localStorage.removeItem('isSuperAdmin');
  localStorage.removeItem('superAdminUsername');
  localStorage.removeItem('super-admin-token');
  localStorage.removeItem('super-admin-refresh-token');
  ;
  window.location.href = '/login';
};