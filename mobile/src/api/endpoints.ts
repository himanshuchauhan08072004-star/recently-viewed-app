export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  RECENTLY_VIEWED: {
    BASE: '/recently-viewed',
    REMOVE: (productId: string) => `/recently-viewed/${productId}`,
    MERGE: '/recently-viewed/merge',
  },
  CONTINUE_SHOPPING: '/continue-shopping',
};
