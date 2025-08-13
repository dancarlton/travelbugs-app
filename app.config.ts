// app.config.ts
import 'dotenv/config';
import type { ExpoConfig } from '@expo/config';

const config = ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
  name: 'TravelBugs',
  slug: 'travelbugs-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,

  scheme: 'travelbugs',
  plugins: ['expo-router'],
  experiments: { typedRoutes: true },

  splash: {
    image: './src/assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },

  ios: {
    bundleIdentifier: 'com.yourname.travelbugs',
    supportsTablet: false,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'We use your location to detect nearby landmarks for stamping.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'We use your location to detect nearby landmarks for stamping.',
    },
  },

  android: {
    package: 'com.yourname.travelbugs',
    permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
  },

  web: {
    favicon: './src/assets/favicon.png',
  },

  extra: {
    ...(config.extra ?? {}),
    MAPBOX_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_TOKEN, // <-- comes from .env
  },
});

export default config;
