import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  getNewlyAddedItems,
  getNoteById,
  getVideoNoteById,
  getTestPaperById,
  getAllCourses,
  getTopicById,
} from '~/lib/api';
import { useColorScheme } from '~/lib/useColorScheme';
import { Note, VideoNote, TestPaper, NewlyAdded } from '~/types/entities';
import NoteCard from '~/components/cards/NoteCard';
import VideoCard from '~/components/cards/VideoCard';
import TestPaperCard from '~/components/cards/TestPaperCard';
import { Stack, useLocalSearchParams } from 'expo-router';
import StartTestDialog from '~/components/StartTestDialog';

const NewlyAddedScreen = () => {
  const { isDarkColorScheme } = useColorScheme();
  const { course } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<(Note | VideoNote | TestPaper)[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestPaper | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getNewlyAddedItems();
        const all = response.data ?? [];

        const filtered = all.filter((entry) =>
          ['Note', 'VideoNote', 'TestPaper'].includes(entry.tableName)
        );

        // fetch course

        const fetchPromises = filtered.map(async (entry) => {
          if (entry.tableName === 'Note') {
            const res = await getNoteById(entry.entityId);
            return res.data;
          } else if (entry.tableName === 'VideoNote') {
            const res = await getVideoNoteById(entry.entityId);
            return res.data;
          } else if (entry.tableName === 'TestPaper') {
            const res = await getTestPaperById(entry.entityId);
            return res.data;
          }
        });

        const results = await Promise.all(fetchPromises);
        const nonNullItems = results.filter(Boolean) as (Note | VideoNote | TestPaper)[];

        const filteredItems = await Promise.all(
          nonNullItems.map(async (item) => {
            if ('topicId' in item) {
              // It's a TestPaper
              const topic = await getTopicById(item.topicId);
              console.log(topic);
              if (!topic) return null;
              return !course || topic?.data?.courseType === course ? item : null;
            } else {
              // Note or VideoNote
              console.log(item.courseType, course);
              return !course || item.courseType === course ? item : null;
            }
          })
        );
        const finalItems = filteredItems.filter((item) => item !== null) as (
          | Note
          | VideoNote
          | TestPaper
        )[];
        console.log(finalItems);
        setItems(filteredItems.filter((item) => item !== null) as (Note | VideoNote | TestPaper)[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={isDarkColorScheme ? '#fff' : '#000'} />
        <Text className="mt-2 text-base">Loading newly added...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-center">No newly added items found.</Text>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Newly Added',
          animation: 'slide_from_right',
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {items.map((item, idx) => {
          if ('fileUrl' in item) {
            return <NoteCard key={idx} item={item} />;
          } else if ('url' in item) {
            return <VideoCard key={idx} item={item} />;
          } else {
            return (
              <TestPaperCard
                key={idx}
                item={item}
                setSelectedTest={setSelectedTest}
                onPress={() => {
                  setVisible(true);
                }}
              />
            );
          }
        })}
      </ScrollView>
      {/* {selectedTest && <TestBottomSheet test={selectedTest} setOpenSheet={setOpenSheet} />} */}
      {selectedTest && (
        <StartTestDialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          test={selectedTest}
        />
      )}
    </>
  );
};

export default NewlyAddedScreen;
