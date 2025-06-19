import axios from 'axios';
import api from './api';
import { getTenantConfig } from '../utils/tenant';


export const checkSubdomain = async (rootApiBaseUrl, subdomain) => {
  console.log('Checking subdomain:', { rootApiBaseUrl, subdomain });
  try {
    const response = await axios.get(`${rootApiBaseUrl}check-subdomain/`, {
      params: { subdomain },
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Check subdomain response:', response.data);
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
  console.log('Sending tenant login request:', { apiBaseUrl, username });
  try {
    const response = await api.post(`${apiBaseUrl}login/`, { username, password }, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Tenant login response:', {
      access: response.data.access?.slice(0, 10) + '...' || 'NOT SET',
      refresh: response.data.refresh?.slice(0, 10) + '...' || 'NOT SET',
      role: response.data.role,
      center: response.data.center,
    });

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
      console.log('Detected email verification required:', {
        user_id: error.response.data.user_id,
        redirect_to: error.response.data.redirect_to,
      });
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
    console.log('Sending superadmin login request:', { username });
    const response = await api.post(`${cleanedRootApiBaseUrl}superadmin-login/`, { username, password });
    console.log('Superadmin login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Superadmin login error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to login.' };
  }
};

export const getUserProfile = async (apiBaseUrl, token) => {
  console.log('Fetching user profile:', { apiBaseUrl });
  try {
    const response = await api.get(`${apiBaseUrl}user-profile/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('User profile response:', response.data);
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
  console.log('Verifying email:', { apiBaseUrl, userId });
  try {
    const response = await api.post(
      `${apiBaseUrl}verify-user/`,
      { user_id: userId, verification_code: verificationCode },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log('Verify email response:', response.data);
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
  console.log('Logged out, localStorage cleared');
  window.location.href = '/login';
};