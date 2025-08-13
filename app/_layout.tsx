import { Stack } from 'expo-router'
import QueryProvider from '../src/app-providers/QueryProvider'
import SupabaseProvider from '../src/app-providers/SupabaseProvider'
import ThemeProvider from '../src/app-providers/ThemeProvider'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <QueryProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
}
