// For local dev on physical device, use your PC's LAN IP instead of localhost
// e.g. 'http://192.168.1.5:5000/api'. After deployment, point this to your
// live Render URL, e.g. 'https://recently-viewed-backend.onrender.com/api'.
export const API_BASE_URL = 'https://recently-viewed-app.onrender.com/api';

// Same host as API_BASE_URL but without the /api suffix — socket.io connects
// at the server root, not under the REST path.
export const SOCKET_BASE_URL = 'https://recently-viewed-app.onrender.com';

export const MAX_RECENTLY_VIEWED = 20;

export const STORAGE_KEYS = {
  GUEST_RECENTLY_VIEWED: '@recently_viewed_guest',
  AUTH_TOKEN: '@auth_token',
};

export const COLORS = {
  background: '#FFFFFF',
  backgroundDark: '#121212',
  surface: '#F7F7F8',
  surfaceDark: '#1E1E1E',
  primary: '#FF3F6C', // Myntra-esque pink-red accent
  text: '#282C3F',
  textDark: '#F5F5F5',
  muted: '#94969F',
  border: '#E9E9EB',
  success: '#03A685',
  discount: '#FF905A',
};
