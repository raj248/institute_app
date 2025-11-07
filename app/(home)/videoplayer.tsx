import { useCallback, useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, BackHandler } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';

import { ToastAndroid } from 'react-native';
import { Button } from '~/components/Button';
import { usePreventScreenCapture } from 'expo-screen-capture';

export default function VideoPlayer() {
  usePreventScreenCapture();

  const { url, title } = useLocalSearchParams<{ url?: string; title?: string }>();
  const { colorScheme, colors } = useColorScheme();
  const webViewRef = useRef<WebViewType>(null);

  const reloadTimerRef = useRef<number | null>(null);
  const [showReload, setShowReload] = useState(false);

  const insets = useSafeAreaInsets();

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
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      NavigationBar.setBehaviorAsync('inset-touch');
      NavigationBar.setVisibilityAsync('visible');
      ScreenOrientation.unlockAsync();
      if (reloadTimerRef.current) {
        clearTimeout(reloadTimerRef.current);
        reloadTimerRef.current = null;
      }
      // console.log('Resetting orientation and status bar');
    });

    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Hide tab bar
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });

      return () =>
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            paddingBottom: insets.bottom,
            height: 65 + insets.bottom,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0,
          }, // restore default
        });
    }, [navigation])
  );

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
          controls: [ 
            'play-large', 
            'play', 
            'pause', 
            'progress', 
            'current-time', 
            'duration', 
            'mute', 
            'volume', 
            'fullscreen', 
            'settings'
          ],
          settings: ['captions', 'quality', 'speed'],
          fullscreen: { enabled: true },
          disableContextMenu: true,
          youtube: {
            rel: 0,
            showinfo: 0,
            noCookie: true,
            modestbranding: 1,
            widget_referrer: 'https://lmsapp.caparveenjindal.com/',
          }
        });

        player.on("ready", () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "READY" }));
        });
      
        player.on("statechange", (e) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "STATE_CHANGE", state: e.detail.code }));
        });
        player.on("error", (e) => {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: "PLYR_ERROR", detail: e })
          );
        });
        
        window.player = player;

        window.addEventListener('unload', () => {
          player.destroy();
        });
        (function() {
          const RNBridge = window.ReactNativeWebView;
          ['log', 'warn', 'error', 'info'].forEach(level => {
            const original = console[level];
            console[level] = function(...args) {
              RNBridge.postMessage(JSON.stringify({ type: "PLYR_LOG", level, args }));
              if (original) original.apply(console, args);
            };
          });
        })();

      </script>
    </body>
  </html>
`;
  const injectedJS = `
  (function() {
    function setReferrer() {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: "REFER_POLICY" })
          );
      } else {
        setTimeout(setReferrer, 100); // retry until iframe exists
      }
    }
    setReferrer();
  })();
  true;
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
            source={{ html: htmlContent, baseUrl: 'https://localhost', }}
            javaScriptEnabled
            domStorageEnabled
            allowsBackForwardNavigationGestures
            allowsProtectedMedia
            cacheMode="LOAD_CACHE_ELSE_NETWORK"
            // cacheEnabled={false}
            geolocationEnabled
            mixedContentMode="always"
            webviewDebuggingEnabled
            style={{ flex: 1 }}
            injectedJavaScript={injectedJS}
            onMessage={(event) => {
              try {
                console.log(event, event.nativeEvent.data);
                const data = JSON.parse(event.nativeEvent.data);
                console.warn(Object.keys(data));
                if (data.type === 'READY') {
                  console.log('State Ready');

                  ToastAndroid.show(
                    'Drag from top and/or press Back to exit fullscreen',
                    ToastAndroid.BOTTOM
                  );

                  // Cancel any previous timer just in case
                  if (reloadTimerRef.current) {
                    clearTimeout(reloadTimerRef.current);
                    reloadTimerRef.current = null;
                  }

                  // Start 3-second timer
                  reloadTimerRef.current = setTimeout(() => {
                    setShowReload(true);
                    reloadTimerRef.current = null; // clear ref once done
                  }, 3000);
                }
                if (data.type === 'STATE_CHANGE') {
                  switch (data.state) {
                    case YTState.ENDED:
                      console.log('Video ended');
                      ToastAndroid.show(
                        'Drag from top and/or press Back to exit fullscreen',
                        ToastAndroid.BOTTOM
                      );
                      break;
                    case YTState.PLAYING:
                      if (reloadTimerRef.current) {
                        clearTimeout(reloadTimerRef.current);
                        reloadTimerRef.current = null;
                      }
                      setShowReload(false); // hide reload when playback starts

                      webViewRef.current?.injectJavaScript(`
                        if (window.player) {
                          player.play();
                        }
                        true; // required for Android
                      `);
                      break;
                    case YTState.PAUSED:
                      console.log('Video paused');
                      break;
                  }
                }
                if (data.type === 'PLYR_LOG') {
                  // This will dump Plyr + console logs into Metro/JS console
                  // console[data.level](...data.args);
                  console.log(data.args, data.level);
                }
                if (data.type === 'PLYR_ERROR') {
                  console.error('Plyr/YouTube error:', data.detail);
                }
                if (data.type === 'REFER_POLICY') {
                  console.warn('Referre set successfully');
                }
              } catch (error) {
                console.error('WebView message parse error:', error);
              }
            }}
            startInLoadingState
            renderLoading={() => (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="mt-2">Loading video...</Text>
              </View>
            )}
            onError={(err) => {
              console.log('Web View Error: ', err);
            }}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
          {showReload && (
            <View
              style={{
                position: 'absolute',
                top: -200,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999,
              }}>
              <Button
                icon="refresh"
                // color="rgba(228, 231, 49, 1)"
                title="Reload"
                // textColor="#111"
                onPress={() => webViewRef.current?.reload()}
              />
            </View>
          )}
        </SafeAreaView>
      ) : (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="mb-4 text-center">Invalid or missing video URL.</Text>
        </View>
      )}
    </>
  );
}

const YTState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};
