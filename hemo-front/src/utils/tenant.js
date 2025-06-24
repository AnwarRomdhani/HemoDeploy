export const getTenantConfig = () => {
  let hostname = window.location.hostname.toLowerCase();
  ;
  hostname = hostname.split(':')[0];
  const parts = hostname.split('.');
  ;

  let subdomain = null;
  let isRoot = false;

  const ROOT_DOMAIN = 'cimssante.com'; // root domain without www

  // Treat 'cimssante.com' and 'www.cimssante.com' as root domain
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}`
  ) {
    isRoot = true;
  } else if (parts.length > ROOT_DOMAIN.split('.').length) {
    // e.g. cilo.cimssante.com
    if (parts[0] === 'www') {
      // Treat www as root
      isRoot = true;
    } else {
      subdomain = parts[0];
    }
  } else {
    isRoot = true;
  }

  const rootDomain = isRoot ? `www.${ROOT_DOMAIN}` : parts.slice(1).join('.') || ROOT_DOMAIN;

  const config = {
    subdomain,
    isRoot,
    apiBaseUrl: isRoot
      ? `https://www.${rootDomain}/api/`
      : `https://${subdomain}.${rootDomain}/centers/api/`,
    rootApiBaseUrl: `https://www.${rootDomain}/api/`,
  };

  ;
  return config;
};
