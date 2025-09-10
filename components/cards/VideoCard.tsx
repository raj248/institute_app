import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { VideoNote } from '~/types/entities';
import { useColorScheme } from '~/lib/useColorScheme';
import { fetchVideoMetadata } from '~/lib/fetchVideoMetadata';

export default function VideoCard({ item }: { item: VideoNote }) {
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();
  const [video, setVideo] = useState<VideoNote & { title?: string; thumbnail?: string }>(item);

  useEffect(() => {
    let isMounted = true;
    fetchVideoMetadata(item).then((v) => {
      if (isMounted) setVideo(v);
    });
    return () => {
      isMounted = false;
    };
  }, [item]);

  return (
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
      onPress={() =>
        router.push({
          pathname: '../(home)/videoplayer',
          params: { url: video.url, title: video.title ?? '' },
        })
      }>
      {video.thumbnail && (
        <Image
          source={{ uri: video.thumbnail }}
          style={{ width: '100%', height: 180 }}
          resizeMode="cover"
        />
      )}
      <View style={{ padding: 12 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '600', color: isDarkColorScheme ? '#aaa' : '#555' }}>
          {video.title ?? 'Untitled Video'}
        </Text>
        <Text style={{ fontSize: 12, color: isDarkColorScheme ? '#aaa' : '#888', marginTop: 4 }}>
          Tap to play on embedded player
        </Text>
      </View>
    </TouchableOpacity>
  );
}
