import { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

export default function SearchTab() {
  const { colors, isDarkColorScheme } = useColorScheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    // Mock search for demonstration:
    if (text.length > 0) {
      setResults([
        `${text} Result 1`,
        `${text} Result 2`,
        `${text} Result 3`,
      ]);
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
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 12,
              borderBottomColor: colors.grey,
              borderBottomWidth: 0.5,
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
