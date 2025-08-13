// app.config.ts
<<<<<<< HEAD
import 'dotenv/config'
import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
=======
import 'dotenv/config';
import type { ExpoConfig } from '@expo/config';

const config = ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
>>>>>>> 78df592 (Set up Mapbox token via app.config.ts and env, clean Explore placeholder)
  name: 'TravelBugs',
  slug: 'travelbugs-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'light',
<<<<<<< HEAD
  newArchEnabled: false,
  scheme: 'travelbugs',

  // IMPORTANT: pass an options object ({}). This avoids the destructure error.
  plugins: [['@rnmapbox/maps', {}], 'expo-location', 'expo-router'],

=======
  newArchEnabled: true,

  scheme: 'travelbugs',
  plugins: ['expo-router'],
>>>>>>> 78df592 (Set up Mapbox token via app.config.ts and env, clean Explore placeholder)
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

<<<<<<< HEAD
  web: { favicon: './src/assets/favicon.png' },

  extra: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },
}

export default config
=======
  web: {
    favicon: './src/assets/favicon.png',
  },

  extra: {
    ...(config.extra ?? {}),
    MAPBOX_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_TOKEN, // <-- comes from .env
  },
});

export default config;
>>>>>>> 78df592 (Set up Mapbox token via app.config.ts and env, clean Explore placeholder)
