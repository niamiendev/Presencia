import { colors } from '@/themes/colors'
import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name='login' />
      <Stack.Screen name='register' options={{ animation: 'fade' }} />
      <Stack.Screen name='forgot' />
    </Stack>
  )
}