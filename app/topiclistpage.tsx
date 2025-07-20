import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import { router, Stack } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';

const mockData = [
  {
    id: 'cmd9uw9pf00032q2rxutxnlw1',
    name: 'Accounting Standards',
    description: 'Learn about the latest accounting standards for CA Inter.',
    testPaperCount: 5,
    attempted: 2,
  },
  {
    id: 'cmd9uw9pf00022q2rhyi2xrz0',
    name: 'Taxation',
    description: 'Direct and indirect tax fundamentals for CA Inter.',
    testPaperCount: 5,
    attempted: 1,
  },
  {
    id: 'cmd9uw9pw00042q2rj2lreqfv',
    name: 'Cost Accounting',
    description: 'Concepts and applications in cost accounting for CA Inter.',
    testPaperCount: 5,
    attempted: 3,
  },
];

const fuse = new Fuse(mockData, {
  keys: ['name', 'description'],
  threshold: 0.3,
});

export default function TopicListPage() {
  const [query, setQuery] = useState('');
  const filteredData = query ? fuse.search(query).map(res => res.item) : mockData;

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
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
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>{item.description}</Text>
      <Text style={{ fontSize: 12, color: '#888', textAlign: 'right' }}>{`${item.attempted}/${item.testPaperCount} Attempted`}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
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
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
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
    </SafeAreaView>
  );
}
