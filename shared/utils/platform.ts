import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

export const getPlatformConfig = () => {
  return {
    platform: Platform.OS,
    features: {
      weather: true,
      ai: true,
      notifications: !isWeb,
      backgroundSync: !isWeb
    }
  };
};

export const getStorageKey = (key: string): string => {
  return `manage_${Platform.OS}_${key}`;
};