import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import { getNotesByTopic } from '~/lib/api';
import { Note } from '~/types/entities';

export default function NotesPage() {
  const { topicId } = useLocalSearchParams();
  const { colors, isDarkColorScheme } = useColorScheme();

  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotes = async () => {
    if (!topicId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getNotesByTopic(topicId as string);
      if (res.error) setError(res.error);
      setNotes(res.data ?? []);
    } catch (err) {
      console.error(err);
      setError('Failed to load notes. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [topicId]);

  const fuse = new Fuse(notes ?? [], {
    keys: ['name', 'description', 'fileName'],
    threshold: 0.5,
  });

  const [query, setQuery] = useState('');
  const filteredData = query ? fuse.search(query).map((res) => res.item) : notes ?? [];

  const renderItem = ({ item }: { item: Note }) => (
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
      onPress={() => router.push({ pathname: './+not_found', params: { url: item.fileUrl, name: item.name } })}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
      {item.description && (
        <Text style={{ fontSize: 14, color: isDarkColorScheme ? '#aaa' : '#555', marginBottom: 8 }}>
          {item.description}
        </Text>
      )}
      <Text
        style={{
          fontSize: 12,
          color: isDarkColorScheme ? '#aaa' : '#888',
          textAlign: 'right',
        }}
      >
        {item.fileName} • {(item.fileSize / (1024 * 1024)).toFixed(2)} MB
      </Text>
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
          title: 'Notes',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />

      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="Search notes..."
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
          <Text className="mt-2">Loading notes...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={fetchNotes}
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
                fetchNotes();
              }}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-center">No notes found for this topic.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
