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
        ;
        setIsValidSubdomain(true);
        return;
      }

      if (!tenantConfig.subdomain) {
        ;
        setIsValidSubdomain(false);
        setSubdomainError('No tenant subdomain provided');
        return;
      }

      ;
      try {
        const response = await axios.get(`${tenantConfig.rootApiBaseUrl}check-subdomain/`, {
          params: { subdomain: tenantConfig.subdomain },
        });
        ;
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

  ;

  return <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>;
};