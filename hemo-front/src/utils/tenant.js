export const getTenantConfig = () => {
  let hostname = window.location.hostname; // e.g., localhost, cilo.localhost, cims-8a3d5cead720.herokuapp.com
  console.log('Raw hostname:', hostname);
  hostname = hostname.split(':')[0]; // Remove port if present
  const parts = hostname.split('.');
  console.log('Hostname parts:', parts);

  let subdomain = null;
  let isRoot = false;

  // Define your root domain here
  const ROOT_DOMAIN = 'cimssante.com';

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Root domain on local dev
    isRoot = true;
  } else if (hostname === ROOT_DOMAIN) {
    // Exactly the root domain (no subdomain)
    isRoot = true;
  } else if (parts.length > ROOT_DOMAIN.split('.').length) {
    // Subdomain present before the root domain
    subdomain = parts[0];
  } else {
    // Fallback: treat as root domain
    isRoot = true;
  }

  const backendPort = 8000;

  // Construct root domain dynamically, fallback to ROOT_DOMAIN
  const rootDomain = isRoot ? ROOT_DOMAIN : parts.slice(1).join('.') || ROOT_DOMAIN;

  const config = {
    subdomain,
    isRoot,
    apiBaseUrl: isRoot
      ? `https://${ROOT_DOMAIN}:${backendPort}/api/`
      : `https://${subdomain}.${rootDomain}:${backendPort}/centers/api/`,
    rootApiBaseUrl: `https://${ROOT_DOMAIN}:${backendPort}/api/`,
  };

  console.log('Tenant Config:', config);
  return config;
};










/*
export const getTenantConfig = () => {
  let hostname = window.location.hostname; // e.g., localhost, cilo.localhost
  console.log('Raw hostname:', hostname);
  hostname = hostname.split(':')[0]; // Remove port if present
  const parts = hostname.split('.');
  console.log('Hostname parts:', parts);

  let subdomain = null;
  let isRoot = false;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Root domain: localhost or 127.0.0.1
    isRoot = true;
  } else if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    // Subdomain on localhost, e.g., cilo.localhost
    subdomain = parts[0];
  } else if (parts.length >= 3) {
    // Subdomain on custom domain, e.g., cilo.example.com
    subdomain = parts[0];
  }

  const backendPort = 8000;
  const rootDomain = isRoot ? 'localhost' : parts.slice(1).join('.') || 'localhost';

  const config = {
    subdomain,
    isRoot,
    apiBaseUrl: isRoot
      ? `http://localhost:${backendPort}/api/`
      : `http://${subdomain}.${rootDomain}:${backendPort}/centers/api/`,
    rootApiBaseUrl: `http://localhost:${backendPort}/api/`,
  };
  console.log('Tenant Config:', config);
  return config;
}; */