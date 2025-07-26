import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import { getTopicsByCourseType } from '~/lib/api';
import { Topic } from '~/types/entities';

export default function TopicListPage() {
  const { course, pageType } = useLocalSearchParams();
  const { colors, isDarkColorScheme } = useColorScheme();

  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTopics = async () => {
    if (!course) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getTopicsByCourseType(course as string);
      const result = res.data;
      if (res.error) setError(res.error);
      setTopics(result ?? []);
    } catch (err) {
      console.error(err);
      setError('Failed to load topics. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [course]);

  const fuse = new Fuse(topics ?? [], {
    keys: ['name', 'description'],
    threshold: 0.6,
  });

  const [query, setQuery] = useState('');
  const filteredData = query ? fuse.search(query).map((res) => res.item) : topics ?? [];

  const renderItem = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isDarkColorScheme ? '#222' : '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => {
        if (pageType === 'mcq') {
          router.push({ pathname: './testlistpage', params: { topicId: item.id } });
        } else if (pageType === 'notes') {
          router.push({ pathname: './notelistpage', params: { topicId: item.id } });
        } else if (pageType === 'mtp') {
          router.push({ pathname: './videolistpage', params: { topicId: item.id, type: 'mtp' } });
        } else if (pageType === 'rtp') {
          router.push({ pathname: './videolistpage', params: { topicId: item.id, type: 'rtp' } });
        } else if (pageType === 'revision') {
          router.push({ pathname: './videolistpage', params: { topicId: item.id, type: 'revision' } });
        } else {
          router.push({ pathname: './+not-found' });
        }
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
      <Text style={{ fontSize: 14, color: isDarkColorScheme ? '#aaa' : '#555', marginBottom: 8 }}>
        {item.description}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: isDarkColorScheme ? '#aaa' : '#888',
          textAlign: 'right',
        }}
      >
        {pageType === 'mcq' ? `${item.testPaperCount} Tests` : pageType === 'notes' ? `${item.noteCount} Notes` : `${item.videoNoteCount} Videos`}
      </Text>
    </TouchableOpacity>
  );

  if (!course) return <SafeAreaView><Text className="text-center p-4">Course not found.</Text></SafeAreaView>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: 'Topics',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />
      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="Search topics..."
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
          <Text className="mt-2">Loading topics...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={fetchTopics}
            style={{
              backgroundColor: "#f1b672ff",
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
                fetchTopics();
              }}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-center">No topics found for this course.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
