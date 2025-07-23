import React, { useState } from 'react';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Stack, useLocalSearchParams } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import { WebView } from 'react-native-webview';

export default function PDFViewer() {
  const { url, name } = useLocalSearchParams<{ url?: string; name?: string }>();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pdfUrl = url;

  if (!pdfUrl) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-center">No PDF URL provided.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: name ?? 'PDF Viewer',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />

      {loading && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2">Loading PDF...</Text>
        </View>
      )}

      {error ? (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => setError(null)}
            style={{
              backgroundColor: '#f1b672ff',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: isDarkColorScheme ? '#222' : '#fff', fontWeight: '800' }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}` }}
          style={{ flex: 1 }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(syntheticEvent) => {
            console.error(syntheticEvent.nativeEvent);
            setError('Failed to load PDF.');
          }}
          scalesPageToFit
          bounces={false}
        />
      )}
    </View>
  );
}
