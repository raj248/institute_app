import React from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';

export default function VideoPlayer() {
  const { url, title } = useLocalSearchParams<{ url?: string; title?: string }>();
  const { colors } = useColorScheme();

  const getEmbeddedUrl = (url?: string) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}?controls=1&autoplay=1`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
        return `https://www.youtube.com/embed/${videoId}?controls=1&autoplay=1`;
      } else {
        return url; // fallback for other video URLs
      }
    } catch (e) {
      return null;
    }
  };

  const embeddedUrl = getEmbeddedUrl(url);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: title ?? 'Video Player',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />
      {embeddedUrl ? (
        <WebView
          source={{ uri: embeddedUrl }}
          style={{ flex: 1 }}
          startInLoadingState
          renderLoading={() => (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="mt-2">Loading video...</Text>
            </View>
          )}
          allowsFullscreenVideo
        />
      ) : (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-center mb-4">Invalid or missing video URL.</Text>
        </View>
      )}
    </View>
  );
}
