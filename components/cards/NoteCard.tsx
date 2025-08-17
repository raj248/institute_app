import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'
import { Note } from '~/types/entities'
import { useColorScheme } from '~/lib/useColorScheme'

export default function NoteCard({ item }: { item: Note }) {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()

  return (
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
      onPress={() => router.push({ pathname: './pdfviewer', params: { url: item.fileUrl, name: item.name } })}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4, color: isDarkColorScheme ? '#aaa' : '#555' }}>{item.name}</Text>
      {item.description && (
        <Text style={{ fontSize: 14, color: isDarkColorScheme ? '#aaa' : '#555', marginBottom: 8 }}>{item.description}</Text>
      )}
      <Text style={{ fontSize: 12, color: isDarkColorScheme ? '#aaa' : '#888', textAlign: 'right' }}>
        {item.fileName} • {(item.fileSize / (1024 * 1024)).toFixed(2)} MB
      </Text>
    </TouchableOpacity>
  )
}
