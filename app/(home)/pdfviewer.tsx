import React, { useState } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import Pdf from 'react-native-pdf';
import { Button } from '~/components/Button';

import Download from './download';

export default function PDFViewer() {
  const { url, name } = useLocalSearchParams<{ url?: string; name?: string }>();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const pdfUrl = (process.env.EXPO_PUBLIC_API_SERVER_URL ?? '') + url;

  if (!url) {
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
          <Text className="mb-4 text-center">{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError(null);
              setLoading(true);
            }}
            style={{
              backgroundColor: '#f1b672ff',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}>
            <Text style={{ color: isDarkColorScheme ? '#222' : '#fff', fontWeight: '800' }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Button
            title="Download PDF"
            disabled={isDownloading}
            icon="download"
            onPress={() => {
              setIsDownloading(true);
              setTimeout(() => {
                setIsDownloading(false);
                // console.log('Download timed out')
              }, 1000);
              // console.log('Downloading PDF...');
            }}
          />
          {isDownloading && <Download url={pdfUrl} />}
          <Pdf
            source={{ uri: pdfUrl, cache: true }}
            style={{ flex: 1, width: Dimensions.get('window').width }}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages, filePath) => {
              setLoading(false);
              // console.log(`Loaded PDF with ${numberOfPages} pages from ${filePath}`);
            }}
            onError={(err) => {
              console.error(err);
              setLoading(false);
              setError('Failed to load PDF.');
            }}
            onLoadProgress={(percent) => {
              if (percent < 1) setLoading(true);
            }}
            enableAnnotationRendering={false}
          />
        </>
      )}
    </View>
  );
}
