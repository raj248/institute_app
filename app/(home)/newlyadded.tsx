import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getNewlyAddedItems, getNoteById, getVideoNoteById, getTestPaperById } from '~/lib/api'
import { useColorScheme } from '~/lib/useColorScheme'
import { Note, VideoNote, TestPaper, NewlyAdded } from '~/types/entities'
import NoteCard from '~/components/cards/NoteCard'
import VideoCard from '~/components/cards/VideoCard'
import TestPaperCard from '~/components/cards/TestPaperCard'
import TestBottomSheet from '~/components/TestBottomSheet'
import { Stack } from 'expo-router'

const NewlyAddedScreen = () => {
  const { isDarkColorScheme } = useColorScheme()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<(Note | VideoNote | TestPaper)[]>([])
  const [openSheet, setOpenSheet] = useState(() => () => { });
  const [selectedTest, setSelectedTest] = useState<TestPaper | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getNewlyAddedItems()
        const all = response.data ?? []

        const filtered = all.filter(entry =>
          ['Note', 'VideoNote', 'TestPaper'].includes(entry.tableName)
        )

        const fetchPromises = filtered.map(async (entry) => {
          if (entry.tableName === 'Note') {
            const res = await getNoteById(entry.entityId)
            return res.data
          } else if (entry.tableName === 'VideoNote') {
            const res = await getVideoNoteById(entry.entityId)
            return res.data
          } else if (entry.tableName === 'TestPaper') {
            const res = await getTestPaperById(entry.entityId)
            return res.data
          }
        })

        const results = await Promise.all(fetchPromises)
        const nonNullItems = results.filter(Boolean) as (Note | VideoNote | TestPaper)[]
        setItems(nonNullItems)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={isDarkColorScheme ? '#fff' : '#000'} />
        <Text className="mt-2 text-base">Loading newly added...</Text>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{
        title: 'Newly Added',
        animation: 'slide_from_right',
      }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {items.map((item, idx) => {
          if ('fileUrl' in item) {
            return <NoteCard key={idx} item={item} />
          } else if ('url' in item) {
            return <VideoCard key={idx} item={item} />
          } else {
            return <TestPaperCard key={idx} item={item} setSelectedTest={setSelectedTest} openSheet={openSheet} />
          }
        })}
      </ScrollView>
      {selectedTest && (
        <TestBottomSheet test={selectedTest} setOpenSheet={setOpenSheet} />
      )}

    </>
  )
}

export default NewlyAddedScreen
