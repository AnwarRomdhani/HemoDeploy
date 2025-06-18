import React, { createContext, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { getTenantConfig } from '../utils/tenant';

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const tenantConfig = useMemo(() => getTenantConfig(), []);
  const [isValidSubdomain, setIsValidSubdomain] = useState(null);
  const [subdomainError, setSubdomainError] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(localStorage.getItem('isSuperAdmin') === 'true');

  useEffect(() => {
    const checkSubdomain = async () => {
      if (tenantConfig.isRoot) {
        console.log('Root domain detected, enabling superadmin mode');
        setIsValidSubdomain(true);
        return;
      }

      if (!tenantConfig.subdomain) {
        console.log('No subdomain provided, treating as invalid');
        setIsValidSubdomain(false);
        setSubdomainError('No tenant subdomain provided');
        return;
      }

      console.log('Checking subdomain:', tenantConfig.subdomain);
      try {
        const response = await axios.get(`${tenantConfig.rootApiBaseUrl}check-subdomain/`, {
          params: { subdomain: tenantConfig.subdomain },
        });
        console.log('Subdomain check response:', response.data);
        setIsValidSubdomain(true);
      } catch (err) {
        console.error('Subdomain check error:', err.response?.data || err.message);
        setIsValidSubdomain(false);
        setSubdomainError(err.response?.data?.error || 'Invalid subdomain.');
      }
    };

    checkSubdomain();
  }, [tenantConfig.subdomain, tenantConfig.rootApiBaseUrl]);

  const contextValue = {
    ...tenantConfig,
    isValidSubdomain,
    subdomainError,
    isSuperAdmin,
    setIsSuperAdmin,
  };

  console.log('TenantContext value:', contextValue);

  return <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>;
};