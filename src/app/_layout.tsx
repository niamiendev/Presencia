import { colors } from "@/themes/colors";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <KeyboardProvider>
    <StatusBar barStyle="dark-content" />
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
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(auth)/forgot" />
        <Stack.Screen name="(protected)" />
      </Stack>
    </KeyboardProvider>
  )
}
