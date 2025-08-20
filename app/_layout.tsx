import { Stack } from 'expo-router';
import QueryProvider from '../src/providers/QueryProvider';
import SupabaseProvider from '../src/providers/SupabaseProvider';
import ThemeProvider from '../src/providers/ThemeProvider';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';

// console.log(
//   'MAPBOX TOKEN (last 6 chars):',
//   (Constants.expoConfig?.extra?.MAPBOX_TOKEN as string)?.slice(-6)
// );

const token = (Constants.expoConfig?.extra as any)?.MAPBOX_TOKEN as string | undefined;
MapboxGL.setAccessToken(token ?? '');
MapboxGL.setTelemetryEnabled(false);

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <QueryProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
