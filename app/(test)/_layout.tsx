// app/(test)/_layout.tsx
import { Stack } from "expo-router";
import { useSegments } from "expo-router";
import { useEffect } from "react";

export default function TestLayout() {
  // Optional: lock orientation or hide status bar here if needed
  return (
    <Stack
      screenOptions={{
        headerShown: false, // if you want immersive test mode
      }}
    />
  );
}
