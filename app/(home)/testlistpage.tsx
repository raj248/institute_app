import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import Fuse from 'fuse.js';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';
import { getAllTestPapersByTopicId, getTopicById } from '~/lib/api';
import { TestPaper, Topic } from '~/types/entities';
import { useColorScheme } from '~/lib/useColorScheme';
import TestBottomSheet from '~/components/TestBottomSheet';

export default function TestListPage() {
  const [openSheet, setOpenSheet] = useState(() => () => { });
  const { topicId } = useLocalSearchParams();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [testPapers, setTestPapers] = useState<TestPaper[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTopic = async () => {
    if (!topicId) return;
    try {
      const topicRes = await getTopicById(topicId as string);
      setTopic(topicRes.data ?? null);
    } catch (e) {
      console.error(e);
    } finally {
    }
  };

  const loadTestPapers = async () => {
    if (!topicId) return;
    // setLoading(true);
    try {
      const res = await getAllTestPapersByTopicId(topicId as string);
      setTestPapers(res.data ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      // setLoading(false);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    loadTopic();
    loadTestPapers();
  }, [topicId]);

  const fuse = new Fuse(testPapers ?? [], {
    keys: ['name', 'description'],
    threshold: 0.3,
  });

  const [query, setQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<TestPaper | null>(null);

  const topicTests = testPapers?.filter(test => test.topicId === topicId);

  const filteredData = query
    ? fuse.search(query).map(res => res.item).filter(test => test.topicId === topicId)
    : topicTests;


  const renderItem = ({ item }: { item: TestPaper }) => (
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
        setSelectedTest(item);
        openSheet();
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
      <Text style={{ fontSize: 14, color: isDarkColorScheme ? '#aaa' : '#555', marginBottom: 8 }}>{item.description}</Text>
      <View className='flex-row justify-between items-center'>
        <Text style={{ fontSize: 12, color: isDarkColorScheme ? '#aaa' : '#888' }}>{`${item.mcqCount} Questions`}</Text>
        <Text style={{ fontSize: 12, color: isDarkColorScheme ? '#aaa' : '#888' }}>{`${item.totalMarks} Marks`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: 'Tests',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />
      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="Search tests..."
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
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadTopic();
              loadTestPapers();
            }}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      {selectedTest && (
        <TestBottomSheet test={selectedTest} setOpenSheet={setOpenSheet} />
      )}
    </View>
  );
}