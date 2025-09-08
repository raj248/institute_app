import React, { useState } from 'react';
import { View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import Pdf from 'react-native-pdf';
import { Feather } from '@expo/vector-icons';

type CollapsiblePDFViewerProps = {
  url: string; // API-relative or absolute PDF URL
  title?: string;
};

export default function CollapsiblePDFViewer({ url, title }: CollapsiblePDFViewerProps) {
  const { colors } = useColorScheme();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pdfUrl = (process.env.EXPO_PUBLIC_API_SERVER_URL ?? '') + url;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.grey3,
        borderRadius: 12,
        overflow: 'hidden',
      }}>
      {/* Header / Toggle */}
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.grey3,
        }}>
        <Feather
          name={expanded ? 'chevron-down' : 'chevron-right'}
          size={18}
          color={colors.background}
        />
        <Text style={{ marginLeft: 8, fontWeight: '600' }}>
          {expanded ? 'Hide Case Study' : 'Show Case Study'}
        </Text>
      </TouchableOpacity>

      {/* Collapsible content */}
      {expanded && (
        <View
          style={{
            height: Dimensions.get('window').height * 0.5,
            backgroundColor: colors.background,
          }}
          pointerEvents="box-none">
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
                  backgroundColor: colors.primary,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Pdf
              source={{ uri: pdfUrl, cache: true }}
              style={{ flex: 1, width: Dimensions.get('window').width }}
              trustAllCerts={false}
              onLoadComplete={(pages) => {
                setLoading(false);
                // console.log(`PDF loaded with ${pages} pages`);
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
          )}
        </View>
      )}
    </View>
  );
}
