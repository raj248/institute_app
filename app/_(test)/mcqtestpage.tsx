import { Drawer } from 'react-native-drawer-layout'
import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, RadioButton, Drawer as PaperDrawer, ActivityIndicator, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from '~/lib/useColorScheme';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { MCQ, TestPaper } from '~/types/entities';
import { getMCQForTest } from '~/lib/api';

export default function McqTestPage() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: "none" },
    });
  }, [navigation]);


  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const { colors, isDarkColorScheme } = useColorScheme();

  const remainingTimeRef = useRef(60 * 30);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      remainingTimeRef.current -= 1;
      if (remainingTimeRef.current % 10 === 0) {
        forceUpdate(n => n + 1); // update UI every 10s
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const { testId } = useLocalSearchParams();
  const [test, setTest] = useState<TestPaper | null>(null);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);


  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<MCQ | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
        return;
      }
      setTest(testRes.data ?? null);

      setMcqs(testRes.data?.mcqs ?? []);
      setCurrentQuestion(testRes.data?.mcqs?.[0] || null);
    } catch (err) {
      console.error(err);
      setError('Failed to load test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaper();
  }, [testId]);

  const handleSelectOption = (value: string) => {
    if (!currentQuestion) return;
    setSelectedOption(value);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    console.log(answers);

    if (!visited.includes(currentQuestion.id)) setVisited(prev => [...prev, currentQuestion.id]);
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    if (currentIndex === mcqs.length - 1) {
      handleEndTest();
      return;
    }
    if (!visited.includes(currentQuestion.id)) setVisited(prev => [...prev, currentQuestion.id]);
    if (currentIndex < mcqs.length - 1)
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        setCurrentQuestion(mcqs[nextIndex] || null);
        return nextIndex;
      });
    console.log(answers[mcqs[currentIndex].id]);

    setSelectedOption(answers[mcqs[currentIndex - 1].id] || '');

  };
  const handlePrevious = () => {
    if (!currentQuestion) return;
    if (!visited.includes(currentQuestion.id)) setVisited(prev => [...prev, currentQuestion.id]);
    if (currentIndex > 0)
      setCurrentIndex(prev => {
        const nextIndex = prev - 1;
        setCurrentQuestion(mcqs[nextIndex] || null);
        return nextIndex;
      });

    console.log(answers[mcqs[currentIndex].id]);

    setSelectedOption(answers[mcqs[currentIndex - 1].id] || '');

  };
  const handleEndTest = () => {
    console.log(answers);
    navigation.goBack();
  };
  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${('0' + (sec % 60)).slice(-2)}`;

  const drawerItems = useMemo(() => mcqs.map((item, index) => {
    const color = visited.includes(item.id)
      ? answers[item.id] ? 'green' : 'red'
      : 'grey';

    return (
      <PaperDrawer.Item
        key={item.id}
        className='mt-2'
        label={`${index + 1}. ${item.question}`}
        style={{ backgroundColor: colors.card, borderRadius: 5 }}
        icon={
          visited.includes(item.id)
            ? answers[item.id]
              ? "check-circle-outline"
              : "close-circle-outline"
            : "circle-outline"
        }
        theme={isDarkColorScheme ? MD3DarkTheme : undefined}
        onPress={() => {
          setDrawerVisible(false);
          setCurrentIndex(index);
          setVisited(prev => [...prev, item.id]);
          setSelectedOption('');
        }}
      />
    )
  }), [mcqs, visited, answers, colors, isDarkColorScheme]);

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

  if (!test || mcqs.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-8">
        <Text className="text-center">No test or MCQs found for this ID.</Text>
      </SafeAreaView>
    );
  }

  return (
    <Drawer
      open={drawerVisible}
      onOpen={() => setDrawerVisible(true)}
      onClose={() => setDrawerVisible(false)}
      drawerPosition="right"
      drawerStyle={{ width: '60%' }}
      renderDrawerContent={() => {
        return (
          <SafeAreaView style={{ backgroundColor: colors.background }} className='flex-1'>{drawerItems}</SafeAreaView>
        )
      }}
    >
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <Stack.Screen
          options={{
            title: 'MCQ Test',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />

        <View className="flex-row justify-between items-center mx-1 mb-4">
          <Button
            onPress={() => {
              alert(`Visited: ${visited.length}/${mcqs.length}\nAttempted: ${Object.keys(answers).length}`);
            }}
            icon="information"
          >
            Info
          </Button>
          <Text variant="heading">Remaining Time: {formatTime(remainingTimeRef.current)}</Text>
          <Button
            onPress={() => setDrawerVisible(true)}
            icon="menu"
          >
            Menu
          </Button>
        </View>

        <ScrollView
          className="flex-1 mx-4"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        >
          <View className="flex flex-col justify-between gap-4">
            <Text variant="title2">
              Q{currentIndex + 1}. {currentQuestion?.question}
            </Text>
            <RadioButton.Group
              onValueChange={handleSelectOption}
              // value={answers[currentQuestion?.id || 0]} // allow undefined
              value={selectedOption} // allow undefined
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
            <Button onPress={handleNext} icon="arrow-right" contentStyle={{ flexDirection: 'row-reverse' }}>{currentIndex === mcqs.length - 1 ? 'End Test' : 'Next'}</Button>
          </View>
        </ScrollView>
      </SafeAreaView>

    </Drawer>
  )
}