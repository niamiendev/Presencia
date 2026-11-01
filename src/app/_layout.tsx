import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { StatusBar } from 'react-native'

SplashScreen.preventAutoHideAsync()

const RootNavigator = () => {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync()
  }, [loading])

  if (loading) return null

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Protected guard={user !== null}>
        <Stack.Screen name='(protected)' />
      </Stack.Protected>

      <Stack.Protected guard={user===null}>
        <Stack.Screen name='(auth)' />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle='dark-content' />
      <AuthProvider> 
        <RootNavigator />
      </AuthProvider>
    </>
  )
}