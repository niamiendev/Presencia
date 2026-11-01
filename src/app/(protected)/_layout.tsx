import { colors } from "@/themes/colors";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={
        {
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          }
        }
      }
    >
      <Stack.Screen name="confirm" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="scanner" />
      <Stack.Screen name="details/[id]" />
    </Stack>
  )
}
