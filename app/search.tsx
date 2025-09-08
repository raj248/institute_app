import { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { searchAll } from '~/lib/api';
import type { SearchResult } from '~/types/entities';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

type FlatItem = {
  id: string;
  title: string;
  type: 'Topic' | 'TestPaper' | 'Note' | 'VideoNote';
};

export default function SearchTab() {
  const { colors, isDarkColorScheme } = useColorScheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FlatItem[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setQuery('');
        setResults([]);
      };
    }, [])
  );

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    const res = await searchAll(text);
    if (res.success && res.data) {
      const flatResults: FlatItem[] = [
        // ...res.data.topics.map((item) => ({ id: item.id, title: item.name, type: 'Topic' as 'Topic' | 'TestPaper' | 'Note' | 'VideoNote' })),
        ...res.data.testPapers.map((item) => ({
          id: item.topicId,
          title: item.name,
          type: 'TestPaper' as 'Topic' | 'TestPaper' | 'Note' | 'VideoNote',
        })),
        ...res.data.notes.map((item) => ({
          id: item.fileUrl,
          title: item.name,
          type: 'Note' as 'Topic' | 'TestPaper' | 'Note' | 'VideoNote',
        })),
        ...res.data.videoNotes.map((item) => ({
          id: item.url,
          title: item.name,
          type: 'VideoNote' as 'Topic' | 'TestPaper' | 'Note' | 'VideoNote',
        })),
      ];
      setResults(flatResults);
    } else {
      setResults([]);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
      }}>
      <Text variant="largeTitle" className="pb-4">
        Search
      </Text>

      <TextInput
        value={query}
        onChangeText={handleSearch}
        placeholder="Search quizzes, topics..."
        placeholderTextColor={isDarkColorScheme ? '#aaa' : '#555'}
        style={{
          backgroundColor: isDarkColorScheme ? '#222' : '#fff',
          color: isDarkColorScheme ? '#fff' : '#000',
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          marginBottom: 16,
        }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.title}-${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 12,
              borderBottomColor: '#c7c7c7',
              borderBottomWidth: 0.5,
            }}
            onPress={() => {
              if (item.type === 'TestPaper') {
                // Handle navigation for TestPaper
                // console.log(`Navigating to TestPaper: ${item.title} (ID: ${item.id})`);
                router.push({ pathname: '/(home)/testlistpage', params: { topicId: item.id } });
              } else if (item.type === 'Note') {
                // Handle navigation for Note
                // console.log(`Navigating to Note: ${item.title} (ID: ${item.id})`);
                router.push({
                  pathname: '/(home)/pdfviewer',
                  params: { url: item.id, name: item.title },
                });
              } else if (item.type === 'VideoNote') {
                // Handle navigation for VideoNote
                // console.log(`Navigating to VideoNote: ${item.title} (ID: ${item.id})`);
                router.push({
                  pathname: '/_(test)/videoplayer',
                  params: { url: item.id, title: item.title },
                });
              }
            }}>
            <Text className="font-medium">{item.title}</Text>
            <Text className="text-xs text-gray-500">{item.type}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
