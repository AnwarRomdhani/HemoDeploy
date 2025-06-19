export const getTenantConfig = () => {
  let hostname = window.location.hostname;
  console.log('Raw hostname:', hostname);
  hostname = hostname.split(':')[0];
  const parts = hostname.split('.');
  console.log('Hostname parts:', parts);

  let subdomain = null;
  let isRoot = false;

  const ROOT_DOMAIN = 'cimssante.com';

  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    parts[0] === 'www'
  ) {
    isRoot = true;
  } else if (parts.length > ROOT_DOMAIN.split('.').length) {
    subdomain = parts[0];
  } else {
    isRoot = true;
  }

  const backendPort = 8000;
  const rootDomain = isRoot ? ROOT_DOMAIN : parts.slice(1).join('.') || ROOT_DOMAIN;

  const config = {
    subdomain,
    isRoot,
    apiBaseUrl: isRoot
      ? `https://${ROOT_DOMAIN}/api/`
      : `https://${subdomain}.${rootDomain}/centers/api/`,
    rootApiBaseUrl: `https://${ROOT_DOMAIN}/api/`,
  };

  console.log('Tenant Config:', config);
  return config;
};
