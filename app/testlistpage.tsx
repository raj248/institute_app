import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import { Stack, useLocalSearchParams } from 'expo-router';
import HeaderIcons from '~/components/HeaderIcons';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { ScrollView } from 'react-native-gesture-handler';
// import { IconButton } from '~/components/IconButton';

const mockTests = [
  {
    id: 'cmd9uw9qr000b2q2rumsticfv',
    name: 'Accounting Standards - Test Paper 5',
    description: 'Practice test paper 5 for Accounting Standards.',
    timeLimitMinutes: 80,
    topicId: 'cmd9uw9pf00032q2rxutxnlw1',
    totalMarks: 14,
    mcqCount: 10,
  },
  {
    id: 'cmd9uw9qr00092q2rg6a7u2el',
    name: 'Accounting Standards - Test Paper 2',
    description: 'Practice test paper 2 for Accounting Standards.',
    timeLimitMinutes: 64,
    topicId: 'cmd9uw9pf00032q2rxutxnlw1',
    totalMarks: 14,
    mcqCount: 10,
  },
  {
    id: 'cmd9uw9qr000c2q2rzj58l1kf',
    name: 'Accounting Standards - Test Paper 1',
    description: 'Practice test paper 1 for Accounting Standards.',
    timeLimitMinutes: 74,
    topicId: 'cmd9uw9pf00032q2rxutxnlw1',
    totalMarks: 14,
    mcqCount: 10,
  },
  {
    id: 'cmd9uw9qr000a2q2reworyuzd',
    name: 'Accounting Standards - Test Paper 4',
    description: 'Practice test paper 4 for Accounting Standards.',
    timeLimitMinutes: 68,
    topicId: 'cmd9uw9pf00032q2rxutxnlw1',
    totalMarks: 14,
    mcqCount: 10,
  },
  {
    id: 'cmda68i1600022qlb5a07uh2b',
    name: 'New Test Paper',
    description: 'No Description here',
    timeLimitMinutes: 100,
    topicId: 'cmd9uw9pf00032q2rxutxnlw1',
    totalMarks: 29,
    mcqCount: 2,
  },
];

const fuse = new Fuse(mockTests, {
  keys: ['name', 'description'],
  threshold: 0.3,
});

function TestBottomSheet({ test, setOpenSheet }: { test: any; setOpenSheet: (fn: () => void) => void }) {
  const bottomSheetModalRef = useSheetRef();

  useEffect(() => {
    if (setOpenSheet) setOpenSheet(() => () => bottomSheetModalRef.current?.present());
  }, [setOpenSheet]);

  return (
    <Sheet ref={bottomSheetModalRef} snapPoints={['80%']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold">{test?.name}</Text>
          {/* <IconButton
            name={'close'}
            color={'white'}
            onPress={() => bottomSheetModalRef.current?.close()}
            className="p-2 bg-red-500 rounded-lg"
          /> */}
        </View>
        <Text className="mb-2 text-gray-700">{test?.description}</Text>
        <Text className="mb-1">⏱ Time Limit: {test?.timeLimitMinutes} minutes</Text>
        <Text className="mb-1">📄 Total Marks: {test?.totalMarks}</Text>
        <Text className="mb-4">❓ MCQ Count: {test?.mcqCount}</Text>

        <TouchableOpacity
          onPress={() => {/* start test logic */ }}
          className="bg-green-600 rounded-lg p-4 mt-4"
        >
          <Text className="text-center text-white font-medium">Start Test</Text>
        </TouchableOpacity>
      </ScrollView>
    </Sheet>
  );
}

export default function TestListPage() {
  const [query, setQuery] = useState('');
  const [openSheet, setOpenSheet] = useState(() => () => { });
  const [selectedTest, setSelectedTest] = useState(null);
  const { topicId } = useLocalSearchParams();

  const topicTests = mockTests.filter(test => test.topicId === topicId);
  const filteredData = query
    ? fuse.search(query).map(res => res.item).filter(test => test.topicId === topicId)
    : topicTests;

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
      onPress={() => {
        setSelectedTest(item);
        openSheet();
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
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
      {selectedTest && (
        <TestBottomSheet test={selectedTest} setOpenSheet={setOpenSheet} />
      )}
    </SafeAreaView>
  );
}