export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://192.168.1.25:3000' 
    : 'https://production.api.meow',
  TIMEOUT: 10000,
};

export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    ERROR: '#FF3B30',
    WARNING: '#FF9500',
    BACKGROUND: '#F2F2F7',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY: {
      LIGHT: '#F2F2F7',
      MEDIUM: '#C7C7CC',
      DARK: '#8E8E93',
    },
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  FONT_SIZES: {
    SMALL: 12,
    MEDIUM: 16,
    LARGE: 18,
    XLARGE: 24,
  },
};