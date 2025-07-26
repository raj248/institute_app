// app/(test)/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from "~/lib/useColorScheme";

export default function TestLayout() {
  // Optional: lock orientation or hide status bar here if needed
  const { isDarkColorScheme, colors } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
        animated={true}
        backgroundColor={colors.background}
        hidden={true}
      />
      <Stack
        screenOptions={{
          headerShown: false, // if you want immersive test mode
        }}
      />
    </>
  );
}
