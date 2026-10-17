/** Prefix a public file path with this repository's GitHub Pages base path. */
const SITE_BASE_PATH = '/portfolio';

export function sitePath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath === SITE_BASE_PATH || normalizedPath.startsWith(`${SITE_BASE_PATH}/`)) {
    return normalizedPath;
  }
  return `${SITE_BASE_PATH}${normalizedPath}`;
}
