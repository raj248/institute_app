import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import { getVideoNotesByTopicId } from '~/lib/api';
import { VideoNote } from '~/types/entities';

export default function VideoListPage() {
  const { topicId, type } = useLocalSearchParams();
  const { colors, isDarkColorScheme } = useColorScheme();

  const [videos, setVideos] = useState<VideoNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const fetchVideoDetails = async (videoNotes: VideoNote[]) => {
    if (!videoNotes || videoNotes.length === 0) {
      setVideos([]);
      return;
    }

    try {
      const updated = await Promise.all(
        videoNotes.map(async (video) => {
          if (!video.url.includes("youtube.com") && !video.url.includes("youtu.be")) {
            return {
              ...video,
              title: "Invalid YouTube URL",
              thumbnail: "https://via.placeholder.com/320x180?text=Invalid+URL",
            };
          }
          try {
            const response = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(video.url)}&format=json`
            );
            if (!response.ok) throw new Error("Failed to fetch video data");
            const data = await response.json();
            return {
              ...video,
              title: data.title,
              thumbnail: data.thumbnail_url,
            };
          } catch {
            return {
              ...video,
              title: "Failed to fetch title",
              thumbnail: "https://via.placeholder.com/320x180?text=Error",
            };
          }
        })
      );
      setVideos(updated);
    } catch (e) {
      console.error(e);
      setVideos([]);
    }
  };

  const fetchVideos = async () => {
    if (!topicId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getVideoNotesByTopicId(topicId as string, type as string);
      if (res.error) setError(res.error);
      else await fetchVideoDetails(res.data ?? []);
    } catch (err) {
      console.error(err);
      setError('Failed to load video notes. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [topicId]);

  const fuse = new Fuse(videos ?? [], {
    keys: ['title'],
    threshold: 0.4,
  });
  const filteredData = query ? fuse.search(query).map((res) => res.item) : videos ?? [];

  const renderItem = ({ item }: { item: VideoNote }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isDarkColorScheme ? '#222' : '#fff',
        borderRadius: 10,
        padding: 0,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
      }}
      onPress={() => router.push({ pathname: '../_(test)/videoplayer', params: { url: item.url, title: item.title ?? '' } })}
    >
      {item.thumbnail && (
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: '100%', height: 180 }}
          resizeMode="cover"
        />
      )}
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title ?? 'Untitled Video'}</Text>
        <Text
          style={{
            fontSize: 12,
            color: isDarkColorScheme ? '#aaa' : '#888',
            marginTop: 4,
          }}
        >
          Tap to play on embedded player
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!topicId) {
    return (
      <SafeAreaView>
        <Text className="text-center p-4">Topic ID not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: 'Video Notes',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />

      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="Search videos..."
          placeholderTextColor={isDarkColorScheme ? '#aaa' : '#555'}
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: isDarkColorScheme ? '#222' : '#fff',
            color: isDarkColorScheme ? '#fff' : '#222',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            fontWeight: '400',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2">Loading video notes...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={fetchVideos}
            style={{
              backgroundColor: '#f1b672ff',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: isDarkColorScheme ? '#222' : '#fff', fontWeight: '800' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchVideos();
              }}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-center">No video notes found for this topic.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
