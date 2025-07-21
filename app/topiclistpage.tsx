import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';
import { useColorScheme } from '~/lib/useColorScheme';
import { getTopicsByCourseType } from '~/lib/api';
import { Topic } from '~/types/entities';



export default function TopicListPage() {
  const { course } = useLocalSearchParams();
  console.log(course);
  if (!course) return <SafeAreaView />;
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopicsByCourseType(course as string)
      .then((res) => {
        const result = res.data
        setTopics(result ?? null)
        if (!result) return
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fuse = new Fuse(topics ?? [], {
    keys: ['name', 'description'],
    threshold: 0.6,
  });

  const [query, setQuery] = useState('');
  const filteredData = query ? fuse.search(query).map(res => res.item) : topics ?? [];

  const { colors, isDarkColorScheme } = useColorScheme();

  const renderItem = ({ item }: { item: any }) => (
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
      onPress={() => router.push(`/testlistpage?topicId=${item.id}`)}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
      <Text style={{ fontSize: 14, color: isDarkColorScheme ? '#aaa' : '#555', marginBottom: 8 }}>{item.description}</Text>
      <Text style={{ fontSize: 12, color: isDarkColorScheme ? '#aaa' : '#888', textAlign: 'right' }}>{`Not Implemented/${item.testPaperCount} Attempted`}</Text>
    </TouchableOpacity>
  );

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
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: isDarkColorScheme ? '#222' : '#fff',
            color: isDarkColorScheme ? '#ccc' : '#222',
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
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
