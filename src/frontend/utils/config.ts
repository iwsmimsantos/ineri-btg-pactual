export const Config = {
  API: {
    BASE_URL: __DEV__ ? 'http://localhost:5000/api' : 'https://your-production-api.com/api',
    TIMEOUT: 120000, // 20 seconds - increased to handle risk profile calculations
    RETRY_ATTEMPTS: 3,
    ENDPOINTS: {
      CLIENT_CLASSIFICATIONS: '/client-classifications',
      CLIENTS: '/clients',
      ADVISORS: '/advisors',
      ASSETS: '/assets'
    }
  },

  APP: {
    NAME: 'INERI',
    VERSION: '1.0.0',
    BUILD: '1'
  },

  FEATURES: {
    ENABLE_DEBUG_LOGS: __DEV__,
    ENABLE_ERROR_REPORTING: !__DEV__,
    ENABLE_ANALYTICS: !__DEV__
  },

  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    REFRESH_INTERVAL: 60000 // 1 minute
  }
} as const;
