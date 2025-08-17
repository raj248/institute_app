import { View, TouchableOpacity, ScrollView } from 'react-native'
import { Text } from '~/components/nativewindui/Text';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { getMCQForTest } from '~/lib/api';
import { useTestStore } from '~/stores/test.store';
import { ActivityIndicator, MD3DarkTheme, RadioButton } from 'react-native-paper';
import { Button } from '~/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Quiz() {
    const navigation = useNavigation();
    const { colors, isDarkColorScheme } = useColorScheme();
    const { testId } = useLocalSearchParams();

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
    const currentOptions = useMemo(() => {
        return Object.entries(currentQuestion?.options ?? {});
    }, [currentQuestion]);

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
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <Stack.Screen options={{ title: 'MCQ Test', animation: 'slide_from_right', headerShown: false }} />
            <View className="flex-row justify-evenly items-center mx-1 mb-4">
                <Button onPress={() => (true)} icon="menu">Menu</Button>
                <Text variant="heading">Remaining Time: {formatTime(remainingTime ?? 0)}</Text>
                <Button onPress={() => {
                    alert(`Visited: ${visited.length}/${testData?.mcqs?.length}\nAttempted: ${Object.keys(answers).length}`);
                }} icon="information">Info</Button>
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
                                rippleColor="transparent"
                            />
                        ))}
                    </RadioButton.Group>
                    <View className="flex-1" style={{
                        backgroundColor: (currentQuestion && currentQuestion?.correctAnswer === answers[currentQuestion.id]) ? '#dbffe3ff' : '#f7d6d6ff',
                        borderWidth: 1,
                        borderColor: (currentQuestion && currentQuestion?.correctAnswer === answers[currentQuestion.id]) ? '#5fe47cff' : '#fd7777ff',
                        borderRadius: 8,
                        padding: 16,
                        marginTop: 16,
                    }}>
                        <Text variant="heading">Correct Answer: {currentQuestion?.correctAnswer.toUpperCase()}</Text>
                        {/* <Text variant="subhead">Marks: {currentQuestion?.marks}</Text> */} {/* @DEPRECATED */}
                        <Text variant="caption1" className='mt-2'><Text className='font-bold' variant={"caption1"}>Explanation:</Text> {currentQuestion?.explanation}</Text>
                    </View>
                </View>

                <View className="flex-row justify-between items-center mx-1 mb-4">
                    <Button title='Previous' onPress={handlePrevious} icon="arrow-left" />
                    <Button title='Clear' onPress={() => handleSelectOption('')} />
                    <Button
                        title={testData.mcqs && currentIndex === testData.mcqs.length - 1 ? 'End Test' : 'Next'}
                        onPress={handleNext}
                        icon="arrow-right"
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}