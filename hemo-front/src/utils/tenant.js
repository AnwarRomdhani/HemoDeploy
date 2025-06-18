export const getTenantConfig = () => {
  let hostname = window.location.hostname; // e.g., localhost, cilo.localhost, cims-8a3d5cead720.herokuapp.com
  console.log('Raw hostname:', hostname);
  hostname = hostname.split(':')[0]; // Remove port if present
  const parts = hostname.split('.');
  console.log('Hostname parts:', parts);

  let subdomain = null;
  let isRoot = false;

  // Define your root domain here
  const ROOT_DOMAIN = 'cims-8a3d5cead720.herokuapp.com';

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
      ? `http://${ROOT_DOMAIN}:${backendPort}/api/`
      : `http://${subdomain}.${rootDomain}:${backendPort}/centers/api/`,
    rootApiBaseUrl: `http://${ROOT_DOMAIN}:${backendPort}/api/`,
  };

  console.log('Tenant Config:', config);
  return config;
};
