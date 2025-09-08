import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, BackHandler } from 'react-native';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';

import { ToastAndroid } from 'react-native';

export default function VideoPlayer() {
  const { url, title } = useLocalSearchParams<{ url?: string; title?: string }>();
  const { colors } = useColorScheme();
  const webViewRef = useRef<WebViewType>(null);

  const getEmbeddedUrl = (url?: string) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) {
        return new URL(url).searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split(/[?&]/)[0];
      }
    } catch (e) {}
    return null;
  };

  const navigation = useNavigation();
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    });
    return subscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', (e) => {
      NavigationBar.setBehaviorAsync('inset-touch');
      NavigationBar.setVisibilityAsync('visible');
      ScreenOrientation.unlockAsync();
      // console.log("Resetting orientation and status bar")
    });

    return unsubscribe;
  }, []);

  const videoId = getEmbeddedUrl(url);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: black;
          height: 100%;
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }

        #player {
          max-width: 100%;
          aspect-ratio: 16 / 9;
        }
      </style>
    </head>
    <body>
      <div id="player" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}"></div>

      <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
      <script>
        const player = new Plyr('#player', {
          autoplay: true,
          controls: ['play', 'pause', 'progress', 'mute', 'volume', 'fullscreen', 'settings'],
          settings: ['captions', 'quality', 'speed'],
          fullscreen: { enabled: true },
          disableContextMenu: true,
          youtube: {
            rel: 0,
            showinfo: 0,
            noCookie: true,
            modestbranding: 1
          }
        });

        player.on("ready", () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "READY" }));
        });

        player.on("statechange", (e) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "STATE_CHANGE", state: e }));
        });
        window.addEventListener('unload', () => {
          player.destroy();
        });
      </script>
    </body>
  </html>
`;
  return (
    <>
      <StatusBar
        key={'root-status-bar-dark'}
        style={'light'}
        animated={true}
        backgroundColor={'black'}
        // hidden={true}
      />
      <Stack.Screen
        options={{
          title: title ?? 'Video Player',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
          headerShown: false,
        }}
      />
      {videoId ? (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#000000' }}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            javaScriptEnabled
            domStorageEnabled
            style={{ flex: 1 }}
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'READY') {
                ToastAndroid.show(
                  'Drag from top and/or press Back to exit fullscreen',
                  ToastAndroid.BOTTOM
                );
              }
              if (data.type === 'STATE_CHANGE') {
                if (data.state.type === 'ended') {
                  ToastAndroid.show(
                    'Drag from top and/or press Back to exit fullscreen',
                    ToastAndroid.BOTTOM
                  );
                }
              }
            }}
            startInLoadingState
            renderLoading={() => (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="mt-2">Loading video...</Text>
              </View>
            )}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </SafeAreaView>
      ) : (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="mb-4 text-center">Invalid or missing video URL.</Text>
        </View>
      )}
    </>
  );
}
