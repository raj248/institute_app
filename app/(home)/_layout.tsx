import '~/global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeToggle } from '~/components/ThemeToggle';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { requestUserPermission, notificationListener } from '~/firebase/notificationService';
import HeaderIcons from '~/components/HeaderIcons';
import { PaperProvider } from 'react-native-paper';
export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme, colors } = useColorScheme();

  const SCREEN_OPTIONS = {
    animation: 'ios_from_right',
    headerStyle: {
      elevation: 5,
      shadowColor: '#000', // Android shadow
      shadowOpacity: 0, // iOS shadow
      backgroundColor: colors.background,
    },
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600',
    },
  } as const;

  const MODAL_OPTIONS = {
    presentation: 'modal',
    animation: 'fade_from_bottom',
    title: 'Settings',
  } as const;

  const INDEX_OPTIONS = {
    title: 'CA Parveen Jindal Classes',

    headerStyle: {
      backgroundColor: '#fff',
    },
    headerRight: () => <HeaderIcons />,
  } as const;

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
        animated={true}
        backgroundColor={colors.background}
      />

      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <NavThemeProvider value={NAV_THEME[colorScheme]}>
            <PaperProvider>
              <Stack screenOptions={SCREEN_OPTIONS}>
                <Stack.Screen name="index" options={INDEX_OPTIONS} />
                <Stack.Screen name="modal" options={MODAL_OPTIONS} />
                <Stack.Screen name="cafinal" options={INDEX_OPTIONS} />
                <Stack.Screen name="cainter" options={INDEX_OPTIONS} />
                <Stack.Screen name="newlyadded" options={INDEX_OPTIONS} />
                <Stack.Screen name="notelistpage" options={INDEX_OPTIONS} />
                <Stack.Screen name="notes" options={INDEX_OPTIONS} />
                <Stack.Screen name="pdfviewer" options={INDEX_OPTIONS} />
                <Stack.Screen name="testlistpage" options={INDEX_OPTIONS} />
                <Stack.Screen name="topiclistpage" options={INDEX_OPTIONS} />
                <Stack.Screen name="videolistpage" options={INDEX_OPTIONS} />

                {/* <Stack.Screen name="notifications" options={NOTIFICATION_OPTIONS} /> */}
              </Stack>
              <Toast />
            </PaperProvider>
          </NavThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}
