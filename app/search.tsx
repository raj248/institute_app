import { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { searchAll } from '~/lib/api';
import type { SearchResult } from '~/types/entities';

type FlatItem = {
  id: string;
  title: string;
  type: 'Topic' | 'TestPaper' | 'Note' | 'VideoNote';
};

export default function SearchTab() {
  const { colors, isDarkColorScheme } = useColorScheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FlatItem[]>([]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    const res = await searchAll(text);
    if (res.success && res.data) {
      const flatResults: FlatItem[] = [
        ...res.data.topics.map((item) => ({ id: item.id, title: item.name, type: 'Topic' as 'Topic' | 'TestPaper' | 'Note' | 'VideoNote' })),
        ...res.data.testPapers.map((item) => ({ id: item.id, title: item.name, type: 'TestPaper' as 'Topic' | 'TestPaper' | 'Note' | 'VideoNote' })),
        ...res.data.notes.map((item) => ({ id: item.id, title: item.name, type: 'Note' as 'Topic' | 'TestPaper' | 'Note' | 'VideoNote' })),
        ...res.data.videoNotes.map((item) => ({ id: item.id, title: item.name, type: 'VideoNote' as 'Topic' | 'TestPaper' | 'Note' | 'VideoNote' })),
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
      }}
    >
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
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 12,
              borderBottomColor: colors.grey,
              borderBottomWidth: 0.5,
            }}
          >
            <Text className="font-medium">{item.title}</Text>
            <Text className="text-xs text-gray-500">{item.type}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
