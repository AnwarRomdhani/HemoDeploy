import axios from 'axios';

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    const isSuperAdminRoute = config.url.includes('/api/superadmin/') || 
                             config.url.includes('/api/governorates/') || 
                             config.url.includes('/api/delegations/') || 
                             config.url.includes('/centers/');
    if (isSuperAdminRoute && !config.url.includes('/api/superadmin/login/')) {
      const superAdminToken = localStorage.getItem('super-admin-token');
      if (superAdminToken) {
        config.headers.Authorization = `Bearer ${superAdminToken}`;
        ;
      }
      if (config.method !== 'get') {
        const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        } else {
          console.warn('CSRF token not found in cookies');
        }
      }
    } else {
      const tenantToken = localStorage.getItem('tenant-token');
      if (tenantToken) {
        config.headers.Authorization = `Bearer ${tenantToken}`;
        ;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      ;
      if (error.config?.url.includes('/api/superadmin/') || 
          error.config?.url.includes('/api/governorates/') || 
          error.config?.url.includes('/api/delegations/') || 
          error.config?.url.includes('/centers/')) {
        localStorage.removeItem('super-admin-token');
        localStorage.removeItem('super-admin-refresh-token');
        localStorage.removeItem('isSuperAdmin');
        localStorage.removeItem('superAdminUsername');
        if (window.location.pathname !== '/superadmin/login') {
          ;
          window.location.href = '/superadmin/login';
        }
      } else {
        localStorage.removeItem('tenant-token');
        localStorage.removeItem('tenant-refresh-token');
        localStorage.removeItem('role');
        localStorage.removeItem('center');
        if (window.location.pathname !== '/login') {
          ;
          window.location.href = '/login';
        }
      }
      return Promise.reject(new Error('Unauthorized request.'));
    }
    return Promise.reject(error);
  }
);

export default api;