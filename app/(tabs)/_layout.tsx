import { Tabs, Redirect } from 'expo-router'
import { useUser } from '@/features/auth/hooks'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout() {
  const { user, isLoading } = useUser()
  if (isLoading) return null
  // if (!user) return <Redirect href='/(auth)/sign-in' />

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='map' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='badges'
        options={{
          title: 'Badges',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='ribbon' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
