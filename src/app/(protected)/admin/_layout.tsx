import { useAuth } from '@/context/AuthContext'
import { colors } from '@/themes/colors'
import { Redirect, Stack } from 'expo-router'

export default function AdminLayout() {
  const { role, loading } = useAuth()

  if (loading) return null
  if (role !== 'admin') return <Redirect href="/" />

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Sites' }} />
      <Stack.Screen name="new-site" options={{ title: 'Nouveau site' }} />
      <Stack.Screen name="site/[id]" options={{ title: 'Détail du site' }} />
      <Stack.Screen name="history" options={{ title: 'Pointages' }} />
    </Stack>
  )
}