import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { TestPaper } from '~/types/entities';
import { Text } from './nativewindui/Text';
import { router, usePathname, useNavigation } from 'expo-router';

export default function TestBottomSheet({
  test,
  setOpenSheet,
}: {
  test: TestPaper;
  setOpenSheet: (fn: () => void) => void;
}) {
  const bottomSheetModalRef = useSheetRef();
  const navigation = useNavigation();
  const pathname = usePathname();

  // Register external trigger
  useEffect(() => {
    if (setOpenSheet) {
      setOpenSheet(() => () => {
        if (bottomSheetModalRef.current) {
          bottomSheetModalRef.current.present();
        }
      });
    }
  }, [setOpenSheet]);

  // Close sheet on route change
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      bottomSheetModalRef.current?.dismiss();
    });
    return unsubscribe;
  }, [navigation]);

  // Always dismiss on unmount
  useEffect(() => {
    return () => {
      bottomSheetModalRef.current?.dismiss();
    };
  }, []);

  // Don’t render on result page
  if (!test || pathname.includes('result')) {
    return null;
  }

  return (
    <Sheet ref={bottomSheetModalRef} snapPoints={['40%', '60%']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text variant={'heading'} className="mb-4 text-center">
          {test?.name}
        </Text>
        <Text variant={'subhead'} className="mb-2 text-center">
          {test?.description}
        </Text>
        <Text className="mb-1 text-center">⏱ Time Limit: {test?.timeLimitMinutes} minutes</Text>
        <Text className="mb-1 text-center">📄 Total Marks: {test?.totalMarks}</Text>
        <Text className="mb-4 text-center">❓ MCQ Count: {test?.mcqCount}</Text>

        <TouchableOpacity
          onPress={() => {
            bottomSheetModalRef.current?.dismiss();
            router.push({
              pathname: `../_(test)/quiz`,
              params: { testId: test.id, date: new Date().toISOString() },
            });
          }}
          className="mt-4 rounded-lg bg-green-600 p-4">
          <Text className="text-center font-medium text-white">Start Test</Text>
        </TouchableOpacity>
      </ScrollView>
    </Sheet>
  );
}
