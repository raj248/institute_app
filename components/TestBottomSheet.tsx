import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { TestPaper } from '~/types/entities';
import { Text } from './nativewindui/Text';
import { router } from 'expo-router';

export default function TestBottomSheet({ test, setOpenSheet }: { test: TestPaper; setOpenSheet: (fn: () => void) => void }) {
  const bottomSheetModalRef = useSheetRef();

  useEffect(() => {
    if (setOpenSheet) setOpenSheet(() => () => bottomSheetModalRef.current?.present());
  }, [setOpenSheet]);

  return (
    <Sheet ref={bottomSheetModalRef} snapPoints={['40%', '60%']}>
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
          // onPress={() => {router.push(`/test/${test.id}`); bottomSheetModalRef.current?.close(); }}
          onPress={() => { router.push(`/mcqtestpage`); bottomSheetModalRef.current?.close(); }}
          className="bg-green-600 rounded-lg p-4 mt-4"
        >
          <Text className="text-center text-white font-medium">Start Test</Text>
        </TouchableOpacity>
      </ScrollView>
    </Sheet>
  );
}
