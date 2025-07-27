import { Drawer } from 'react-native-drawer-layout';
import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, RadioButton, Drawer as PaperDrawer, ActivityIndicator, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from '~/lib/useColorScheme';
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { getMCQForTest } from '~/lib/api';
import { useTestStore } from '~/store/test.store';

export default function McqTestPage() {
  const navigation = useNavigation();
  const { colors, isDarkColorScheme } = useColorScheme();
  const { testId } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }, [navigation]);

  const {
    testData,
    visited,
    currentIndex,
    currentQuestion,
    answers,
    remainingTime,

    addVisited,
    setCurrentIndex,
    setCurrentQuestion,
    setTestData,
    setRemainingTime,
    startTimer,
    stopTimer,
    setAnswer,
  } = useTestStore(state => ({
    testData: state.testData,
    visited: state.visited,
    currentIndex: state.currentIndex,
    currentQuestion: state.currentQuestion,
    answers: state.answers,
    remainingTime: state.remainingTime,

    addVisited: state.addVisited,
    setCurrentIndex: state.setCurrentIndex,
    setCurrentQuestion: state.setCurrentQuestion,
    setTestData: state.setTestData,
    setRemainingTime: state.setRemainingTime,
    startTimer: state.startTimer,
    stopTimer: state.stopTimer,
    setAnswer: state.setAnswer,
  }));

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Drawer Visible: ", drawerVisible);

  }, [drawerVisible]);


  const loadPaper = async () => {
    if (!testId) {
      setError('Test ID not provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const testRes = await getMCQForTest(testId as string);
      if (testRes.error) {
        setError(testRes.error);
      } else if (testRes.data) {
        setTestData(testRes.data);
        if (testRes.data.timeLimitMinutes) {
          setRemainingTime(testRes.data.timeLimitMinutes * 60);
          startTimer();
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaper();
    return () => stopTimer();
  }, [testId]);

  const handleSelectOption = (value: string) => {
    if (!currentQuestion) return;
    setAnswer(currentQuestion.id, value);
    addVisited(currentQuestion.id);
  };

  const handleNext = () => {
    if (!testData?.mcqs?.length || !currentQuestion) return;
    const mcqs = testData.mcqs;

    if (currentIndex === mcqs.length - 1) {
      handleEndTest();
      return;
    }

    addVisited(currentQuestion.id);
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentQuestion(mcqs[nextIndex]);
  };

  const handlePrevious = () => {
    if (!testData?.mcqs?.length || !currentQuestion) return;
    const mcqs = testData.mcqs;

    addVisited(currentQuestion.id);

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentQuestion(mcqs[prevIndex]);
    }
  };

  const handleEndTest = () => {
    stopTimer();
    router.push("./testresultpage")
  };

  useEffect(() => {
    if (remainingTime === 0) {
      // Stop timer
      useTestStore.getState().stopTimer();

      // Perform any cleanup: save data, calculate score, mark test complete, etc.
      console.log('Time up, ending test automatically');
      handleEndTest();
    }
  }, [remainingTime]);

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${('0' + (sec % 60)).slice(-2)}`;

  const [drawerItems, setDrawerItems] = useState<React.ReactNode[]>([]);

  const computeDrawerItems = () => {
    if (!testData?.mcqs) return [];
    return testData.mcqs.map((item, index) => {
      const attempted = answers[item.id];
      const visitedStatus = visited.includes(item.id);
      const icon = visitedStatus
        ? attempted ? 'check-circle-outline' : 'close-circle-outline'
        : 'circle-outline';
      return (
        <PaperDrawer.Item
          key={item.id}
          className='mt-1'
          label={`Question ${index + 1}.`}
          style={{ backgroundColor: colors.card, borderRadius: 5 }}
          icon={icon}
          theme={isDarkColorScheme ? MD3DarkTheme : undefined}
          onPress={() => {
            setDrawerVisible(false);
            setCurrentIndex(index);
            setCurrentQuestion(item);
            addVisited(item.id);
          }}
        />
      );
    });
  };

  const currentOptions = useMemo(() => {
    return Object.entries(currentQuestion?.options ?? {});
  }, [currentQuestion]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-2">Loading test...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-8">
        <Text className="text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={loadPaper}
          disabled={loading}
          style={{
            backgroundColor: "#f1b672ff",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: isDarkColorScheme ? '#222' : '#fff', fontWeight: '800' }}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!testData || testData.mcqs?.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-8">
        <Text className="text-center">No test or MCQs found for this ID.</Text>
      </SafeAreaView>
    );
  }

  return (
    <Drawer
      open={drawerVisible}
      swipeEnabled={false}
      onOpen={() => {
        setDrawerVisible(true);
        setDrawerItems(computeDrawerItems());
      }}
      onClose={() => setDrawerVisible(false)}
      drawerPosition="right"
      drawerStyle={{ width: '60%' }}
      renderDrawerContent={() => (
        <SafeAreaView style={{ backgroundColor: colors.background }} className='flex-1'>{drawerItems}</SafeAreaView>
      )}
    >
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <Stack.Screen options={{ title: 'MCQ Test', animation: 'slide_from_right', headerShown: false }} />
        <View className="flex-row justify-between items-center mx-1 mb-4">
          <Button onPress={() => {
            alert(`Visited: ${visited.length}/${testData?.mcqs?.length}\nAttempted: ${Object.keys(answers).length}`);
          }} icon="information">Info</Button>
          <Text variant="heading">Remaining Time: {formatTime(remainingTime ?? 0)}</Text>
          <Button onPress={() => setDrawerVisible(true)} icon="menu">Menu</Button>
        </View>

        <ScrollView className="flex-1 mx-4" contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <View className="flex flex-col justify-between gap-4">
            <Text variant="title2">Q{currentIndex + 1}. {currentQuestion?.question}</Text>
            <RadioButton.Group
              onValueChange={handleSelectOption}
              value={currentQuestion ? answers[currentQuestion.id] ?? '' : ''}
            >
              {currentOptions.map(([key, value]) => (
                <RadioButton.Item
                  key={key}
                  label={value}
                  value={key}
                  style={{
                    backgroundColor: isDarkColorScheme ? "#222" : "#fff",
                    marginTop: 5,
                    borderRadius: 8,
                  }}
                  theme={isDarkColorScheme ? MD3DarkTheme : undefined}
                />
              ))}
            </RadioButton.Group>
          </View>

          <View className="flex-row justify-between items-center mx-1 mb-4">
            <Button onPress={handlePrevious} icon="arrow-left">Previous</Button>
            <Button mode="outlined" onPress={() => handleSelectOption('')}>Clear</Button>
            <Button onPress={handleNext} icon="arrow-right" contentStyle={{ flexDirection: 'row-reverse' }}>
              {testData.mcqs && currentIndex === testData.mcqs.length - 1 ? 'End Test' : 'Next'}
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Drawer>
  );
}
