import { View, TouchableOpacity, Pressable } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import React, { useEffect, useMemo, useState } from 'react';
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { getMCQForTest } from '~/lib/api';
import { ActivityIndicator, Icon, MD3DarkTheme, RadioButton } from 'react-native-paper';
import { Button } from '~/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MCQ, TestPaper } from '~/types/entities';
import ConfirmExitDialog from '~/components/ConfirmDialog';

import { Provider as PaperProvider } from 'react-native-paper';
import CollapsiblePDFViewer from '~/components/CollapsiblePdfViewer';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Quiz() {
  const navigation = useNavigation();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const { testId, date } = useLocalSearchParams();
  const [testData, setTestData] = useState<TestPaper>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<MCQ>();

  const [answers, setAnswer] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [remainingTime, setRemainingTime] = useState<number>();
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>();

  const decrementTime = () => {
    setRemainingTime((prev) => {
      if (prev && prev > 0) return prev - 1;
      stopTimer();
      return 0;
    });
  };

  const startTimer = (seconds: number) => {
    stopTimer(); // clear any previous timer
    setRemainingTime(seconds);
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          setTimerInterval(null);
          handleEndTest(); // end test automatically
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimerInterval(null);
  };

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
        setCurrentIndex(0);
        setCurrentQuestion(testRes.data.mcqs?.[0]);
        setAnswer({});
        if (testRes.data.timeLimitMinutes) {
          startTimer(testRes.data.timeLimitMinutes * 60);
        } else {
          setRemainingTime(0);
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
    setTestEnded(false);
    setAnswer({});
    setCurrentIndex(0);
    setCurrentQuestion(undefined);
    loadPaper();
  }, [testId, date]);

  const handleSelectOption = (value: string) => {
    if (!currentQuestion || isAnswered) return;

    if (value === '') {
      // create a new copy without the current question id
      const updatedAnswers = { ...answers };
      delete updatedAnswers[currentQuestion.id];
      setTempSelection('');
      setAnswer(updatedAnswers);
      return;
    }

    setAnswer({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (!testData?.mcqs?.length || !currentQuestion) return;
    const mcqs = testData.mcqs;

    if (currentIndex === mcqs.length - 1) {
      handleEndTest();
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentQuestion(mcqs[nextIndex]);
  };
  const handlePrevious = () => {
    if (!testData?.mcqs?.length || !currentQuestion) return;
    const mcqs = testData.mcqs;

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentQuestion(mcqs[prevIndex]);
    }
  };

  const [testEnded, setTestEnded] = useState(false);

  const handleEndTest = async () => {
    if (testEnded) return; // <--- prevent double execution
    // console.log('Ending Test');
    setTestEnded(true);
    stopTimer();
    // setTestData(undefined);
    const jsonAnswers = JSON.stringify(answers);
    const encodedAnswers = encodeURIComponent(jsonAnswers);
    setCurrentIndex(0);
    setAnswer({});
    setCurrentQuestion(testData?.mcqs?.[0]);
    setTempSelection('');

    // console.log('answers:' + encodedAnswers);
    // await AsyncStorage.setItem('answers', encodedAnswers);
    router.replace({
      pathname: '/(home)/result',
      params: { testId: testId, answers: encodedAnswers },
    });

    // working navigation below

    // router.push('/(home)');
    // router.dismissAll();
  };

  const currentOptions = useMemo(() => {
    return Object.entries(currentQuestion?.options ?? {});
  }, [currentQuestion]);

  useEffect(() => {
    if (remainingTime === 0) {
      // console.log('Time up, ending test automatically');
      handleEndTest();
    }
  }, [remainingTime]);

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${('0' + (sec % 60)).slice(-2)}`;

  const isAnswered = answers[currentQuestion?.id ?? ''] !== undefined;
  const isLastQuestion = currentIndex === (testData?.mcqs?.length ?? 0) - 1;

  let buttonText = 'Submit';
  if (isAnswered) {
    buttonText = isLastQuestion ? 'End' : 'Next';
  }

  const [tempSelection, setTempSelection] = React.useState<string>('');
  useEffect(() => {
    if (currentQuestion) {
      setTempSelection(answers[currentQuestion.id] ?? '');
    }
  }, [currentQuestion]);
  const handleSubmit = () => {
    if (!currentQuestion) return;
    // If you want to save permanently later:
    setAnswer({ ...answers, [currentQuestion.id]: tempSelection });
  };

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
        <Text className="mb-4 text-center">{error}</Text>
        <TouchableOpacity
          onPress={loadPaper}
          disabled={loading}
          style={{
            backgroundColor: '#f1b672ff',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}>
          <Text style={{ color: isDarkColorScheme ? '#222' : '#fff', fontWeight: '800' }}>
            Try Again
          </Text>
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

  // console.log('Test Data NotePath', testData.notePath);
  return (
    <GestureHandlerRootView>
      <PaperProvider>
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
          <Stack.Screen
            options={{ title: 'MCQ Test', animation: 'slide_from_right', headerShown: false }}
          />
          <View className=" mx-1 mb-4 flex-row items-center justify-between">
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 16,
              }}>
              <Icon size={20} source={'clock'} />
              <Text variant="heading" style={{ marginLeft: 6 }}>
                {' '}
                {formatTime(remainingTime ?? 0)}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                // router.replace('/(home)');
                // router.dismissAll();
                setDialogVisible(true);
              }}
              style={{
                backgroundColor: '#ddd',
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderRadius: 8,
                marginRight: 16,
              }}>
              <Icon size={20} color="red" source={'exit-to-app'} />
            </Pressable>
          </View>

          {/* if notepath available, show a view Case Study button, that will open a pdfviewer */}
          {testData.notePath && (
            <CollapsiblePDFViewer url={testData.notePath} title={'Show Case Study'} />
          )}
          <ScrollView
            className="mx-4 flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
            <View className="flex flex-col justify-between gap-4">
              {testData.isCaseStudy && testData.caseText && (
                <View
                  className="flex-1"
                  style={{
                    backgroundColor: isDarkColorScheme ? '#222' : '#fff',
                    borderWidth: 1,
                    borderColor: isDarkColorScheme ? '#333' : '#eee',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16,
                  }}>
                  <Text variant="subhead" className="mb-2 font-bold">
                    Case Study:
                  </Text>
                  <Text variant="body">{testData.caseText}</Text>
                </View>
              )}

              <Text variant="title2">
                Q{currentIndex + 1}. {currentQuestion?.question}
              </Text>
              <RadioButton.Group
                onValueChange={(value) => {
                  !isAnswered && setTempSelection(value);
                }}
                value={tempSelection}>
                {currentOptions.map(([key, value]: [string, string]) => (
                  // prevented changing options when isAnswered is true
                  <RadioButton.Item
                    key={key}
                    label={key.toUpperCase() + '. ' + value}
                    value={key}
                    style={{
                      backgroundColor: isDarkColorScheme ? '#222' : '#fff',
                      marginTop: 5,
                      borderRadius: 8,
                    }}
                    theme={isDarkColorScheme ? MD3DarkTheme : undefined}
                    rippleColor="transparent"
                  />
                ))}
              </RadioButton.Group>
              {isAnswered && (
                <View
                  className="flex-1"
                  style={{
                    backgroundColor:
                      currentQuestion &&
                      currentQuestion?.correctAnswer === answers[currentQuestion.id]
                        ? '#dbffe3ff'
                        : '#f7d6d6ff',
                    borderWidth: 1,
                    borderColor:
                      currentQuestion &&
                      currentQuestion?.correctAnswer === answers[currentQuestion.id]
                        ? '#5fe47cff'
                        : '#fd7777ff',
                    borderRadius: 8,
                    padding: 16,
                    marginTop: 16,
                  }}>
                  <Text variant="heading">
                    Correct Answer: {currentQuestion?.correctAnswer.toUpperCase()}
                  </Text>

                  <Text variant="caption1" className="mt-2">
                    <Text className="font-bold" variant={'caption1'}>
                      Explanation:
                    </Text>{' '}
                    {currentQuestion?.explanation}
                  </Text>
                </View>
              )}
            </View>

            <View className="mx-1 mb-4 flex-row items-center justify-between">
              <Button textColor="black" color="#fff" title="Previous" onPress={handlePrevious} />
              <Button
                textColor="black"
                color="#fff"
                title="Clear"
                onPress={() => handleSelectOption('')}
              />
              <Button
                title={buttonText}
                textColor="black"
                color="#fff"
                onPress={() => {
                  if (!isAnswered) {
                    // maybe show a toast or validation
                    handleSubmit();
                    return;
                  }

                  if (isLastQuestion) {
                    // end test
                    // stopTimer();
                    handleEndTest();
                  } else {
                    // go to next
                    // setCurrentIndex((prev) => prev + 1);
                    handleNext();
                  }
                }}
              />
            </View>
            <ConfirmExitDialog
              visible={dialogVisible}
              onDismiss={() => setDialogVisible(false)}
              onConfirm={handleEndTest}
            />
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
