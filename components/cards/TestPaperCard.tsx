import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { TestPaper } from '~/types/entities';
import { useColorScheme } from '~/lib/useColorScheme';

export default function TestPaperCard({
  item,
  setSelectedTest,
  onPress,
}: {
  item: TestPaper;
  setSelectedTest: (test: TestPaper) => void;
  onPress: () => void;
}) {
  const { isDarkColorScheme } = useColorScheme();
  // const { setSelectedTest, onPress } = useSheetStore()

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
      onPress={() => {
        setSelectedTest(item);
        onPress();
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 4,
          color: isDarkColorScheme ? '#aaa' : '#555',
        }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 14, color: isDarkColorScheme ? '#aaa' : '#555', marginBottom: 8 }}>
        {item.description}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text
          style={{
            fontSize: 12,
            color: isDarkColorScheme ? '#aaa' : '#888',
          }}>{`${item.mcqCount} Questions`}</Text>
        <Text
          style={{
            fontSize: 12,
            color: isDarkColorScheme ? '#aaa' : '#888',
          }}>{`${item.totalMarks} Marks`}</Text>
      </View>
    </TouchableOpacity>
  );
}
