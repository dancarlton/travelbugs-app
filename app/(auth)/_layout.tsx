import { Stack, Redirect } from 'expo-router'
import { useUser } from '../../src/features/auth/hooks'

export default function AuthLayout() {
  const { user, isLoading } = useUser()
  if (isLoading) return null
  if (user) return <Redirect href='/(tabs)/home' />
  return <Stack screenOptions={{ headerShown: false }} />
}
