// Vazhi — Root Layout (replaces the default Expo tab template)
//
// WHERE TO PUT THIS FILE:
//   Replace the existing content of: Vazhi/mobile/app/_layout.tsx
//   (don't create a new file — open the existing _layout.tsx and replace everything in it)
//
// WHAT THIS DOES:
//   Vazhi doesn't use bottom tabs. This sets up a simple linear stack of screens:
//   onboarding -> home -> transcription -> schemes -> listing
//   The app now opens directly on the Onboarding screen when launched.
//
// NOTE: We removed the "(tabs)" and "modal" references from the original template
// since Vazhi doesn't use them. If you want to keep the default tabs/modal demo
// screens around for reference, you can, but they won't be shown to the user.

import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: 'onboarding',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="transcription" options={{ headerShown: false }} />
        <Stack.Screen name="schemes" options={{ headerShown: false }} />
        <Stack.Screen name="listing" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}