import { colors } from '@/themes/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={
        {
          headerShown: false,
          tabBarActiveTintColor:colors.primary,
          tabBarInactiveTintColor:colors.textSecondary,
          tabBarStyle:{
            backgroundColor:colors.background
          }
        }
      }
    >
      <Tabs.Screen name="home"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={
              focused ? "home" : "home-outline"
            }
              color={color as string} size={size}
            />
          ),
        }} />
      <Tabs.Screen name="scanner" options={{
          title: 'Profil',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={
              focused ? "scan" : "scan-outline"
            }
              color={color as string} size={size}
            />
          ),
        }} />
      <Tabs.Screen name="historic" options={{
          title: 'Profil',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={
              focused ? "time" : "time-outline"
            }
              color={color as string} size={size}
            />
          ),
        }} />
      <Tabs.Screen name="profile" options={{
          title: 'Profil',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={
              focused ? "person" : "person"
            }
              color={color as string} size={size}
            />
          ),
        }} />
    </Tabs>
  )
}
