const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

export function withBasePath(path) {
  if (!path || ABSOLUTE_URL.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
