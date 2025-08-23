import * as NavigationBar from 'expo-navigation-bar';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform } from 'react-native';

import { COLORS } from '~/theme/colors';

function useColorScheme() {
  const { colorScheme: nativewindScheme, setColorScheme: setNativewindScheme } =
    useNativewindColorScheme();

  const colorScheme = 'light';
  const [currentScheme, setCurrentScheme] = React.useState<'light' | 'dark'>(colorScheme);

  // Sync navigation bar and nativewind AFTER mount only
  React.useEffect(() => {
    setCurrentScheme(colorScheme);
    setNativewindScheme(colorScheme);
    if (Platform.OS === 'android') {
      setNavigationBar(colorScheme).catch(console.error);
    }
  }, [colorScheme]);

  const toggleColorScheme = React.useCallback(() => {
    const nextScheme = currentScheme === 'light' ? 'light' : 'light';
    setNativewindScheme(nextScheme);
    setCurrentScheme(nextScheme);
    if (Platform.OS === 'android') {
      setNavigationBar(nextScheme).catch(console.error);
    }
  }, [currentScheme]);

  return {
    colorScheme: currentScheme,
    // isDarkColorScheme: currentScheme === 'dark',
    isDarkColorScheme: false,
    setColorScheme: setNativewindScheme,
    toggleColorScheme,
    colors: COLORS[currentScheme],
  };
}

function useInitialAndroidBarSync() {
  const systemScheme = useSystemColorScheme();

  React.useEffect(() => {
    if (Platform.OS !== 'android' || !systemScheme) return;
    setNavigationBar(systemScheme).catch(console.error);
  }, [systemScheme]);
}

function setNavigationBar(colorScheme: 'light' | 'dark') {
  return Promise.all([
    NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark'),
    NavigationBar.setPositionAsync('absolute'),
    NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? '#00000030' : '#ffffff80'),
  ]);
}

export { useColorScheme, useInitialAndroidBarSync };
