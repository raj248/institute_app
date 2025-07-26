import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, Dimensions, Button } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';

export default function VideoPlayer() {
  const { url, title } = useLocalSearchParams<{ url?: string; title?: string }>();
  const { colors } = useColorScheme();
  const webViewRef = useRef<WebViewType>(null);
  const [playerReady, setPlayerReady] = useState(false);

  const getEmbeddedUrl = (url?: string) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) {
        return new URL(url).searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split(/[?&]/)[0];
      }
    } catch (e) { }
    return null;
  };

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
            overflow: hidden;
          }
          .plyr__video-embed iframe {
            pointer-events: none; /* disable iframe overlays like Watch on YouTube */
          }
        </style>
      </head>
      <body>
        <div id="player" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}"></div>

        <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
        <script>
          const player = new Plyr('#player', {
            autoplay: true,
            controls: ['play', 'pause', 'progress', 'mute', 'volume'],
            disableContextMenu: true,
            youtube: {
              rel: 0,
              showinfo: 0,
              noCookie: true,
              modestbranding: 1
            }
          });

          document.addEventListener("message", (e) => {
            const msg = JSON.parse(e.data);
            if (msg.command === "play") player.play();
            if (msg.command === "pause") player.pause();
            if (msg.command === "seek") player.currentTime = msg.time;
          });

          player.on("ready", () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "READY" }));
          });

          player.on("statechange", (e) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "STATE_CHANGE", state: e }));
          });
        </script>
      </body>
    </html>
  `;

  const sendCommand = (command: object) => {
    webViewRef.current?.postMessage(JSON.stringify(command));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: title ?? 'Video Player',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />
      {videoId ? (
        <>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            javaScriptEnabled
            domStorageEnabled
            style={{ flex: 1 }}
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'READY') setPlayerReady(true);
            }}
            startInLoadingState
            renderLoading={() => (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="mt-2">Loading video...</Text>
              </View>
            )}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
          {playerReady && (
            <View className="flex-row justify-around p-4">
              <Button title="▶ Play" onPress={() => sendCommand({ command: 'play' })} />
              <Button title="⏸ Pause" onPress={() => sendCommand({ command: 'pause' })} />
              <Button title="⏩ Seek 60s" onPress={() => sendCommand({ command: 'seek', time: 60 })} />
            </View>
          )}
        </>
      ) : (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-center mb-4">Invalid or missing video URL.</Text>
        </View>
      )}
    </View>
  );
}
