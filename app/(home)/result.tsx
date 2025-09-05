// showing test results here , like accuracy , total questions, correct, wrong, etc
import { View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Button } from 'react-native-paper';
// import { Button } from '~/components/Button';
import { getMCQForTest } from '~/lib/api';
import { MCQ, TestPaper } from '~/types/entities';
import { ActivityIndicator } from 'react-native-paper';

export default function ResultsPage() {
  const { colors, isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const { testId, answers: encodedAnswers } = useLocalSearchParams<{
    testId: string;
    answers: string;
  }>();

  console.log('Inside ResultsPage');

  const [testData, setTestData] = useState<TestPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unanswered: number;
    score: number;
    accuracy: string;
  } | null>(null);

  useEffect(() => {
    const calculateResults = async () => {
      if (!testId || !encodedAnswers) {
        setError('Test ID or answers not provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const testRes = await getMCQForTest(testId);
        if (testRes.error) {
          setError(testRes.error);
          setLoading(false);
          return;
        }
        if (!testRes.data || !testRes.data.mcqs) {
          setError('Test data not found.');
          setLoading(false);
          return;
        }

        setTestData(testRes.data);
        const mcqs: MCQ[] = testRes.data.mcqs;
        const userAnswers: Record<string, string> = JSON.parse(encodedAnswers);

        let totalQuestions = 0;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let unanswered = 0;
        let score = 0;

        mcqs.forEach((mcq) => {
          totalQuestions++;
          const userAnswer = userAnswers[mcq.id];
          if (userAnswer) {
            if (userAnswer === mcq.correctAnswer) {
              correctAnswers++;
              score++;
            } else {
              wrongAnswers++;
            }
          } else {
            unanswered++;
          }
        });

        const accuracy =
          totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : '0.00';

        setResults({
          totalQuestions,
          correctAnswers,
          wrongAnswers,
          unanswered,
          score,
          accuracy,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to calculate results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    calculateResults();
  }, [testId, encodedAnswers]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-2">Calculating results...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-8">
        <Text className="mb-4 text-center">{error}</Text>
        <TouchableOpacity
          onPress={() => {
            // Optionally, re-run calculation or navigate back
            router.back();
          }}
          style={{
            backgroundColor: '#f1b672ff',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}>
          <Text style={{ color: isDarkColorScheme ? '#222' : '#fff', fontWeight: '800' }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!results) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-8">
        <Text className="text-center">No results to display.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: 'Test Results',
          animation: 'slide_from_right',
          headerShown: false,
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View className="mb-8 items-center">
          <Text variant="largeTitle" style={{ color: colors.primary }}>
            {results.score} / {results.totalQuestions}
          </Text>
          <Text variant="subhead" className="mt-2">
            Your Score
          </Text>
        </View>

        <View
          style={{
            backgroundColor: isDarkColorScheme ? '#222' : '#fff',
            borderRadius: 10,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Text variant="heading" className="mb-4 text-center">
            Summary
          </Text>
          <View className="flex-row justify-between py-2">
            <Text>Total Questions:</Text>
            <Text className="font-bold">{results.totalQuestions}</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text style={{ color: 'green' }}>Correct Answers:</Text>
            <Text className="font-bold" style={{ color: 'green' }}>
              {results.correctAnswers}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text style={{ color: 'red' }}>Wrong Answers:</Text>
            <Text className="font-bold" style={{ color: 'red' }}>
              {results.wrongAnswers}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text>Unanswered:</Text>
            <Text className="font-bold">{results.unanswered}</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text>Accuracy:</Text>
            <Text className="font-bold">{results.accuracy}%</Text>
          </View>
        </View>

        {/* <Button
          mode="contained"
          onPress={() => {
            router.replace({
              pathname: '/_(test)/testresultpage',
              params: { testId: testId },
            });
          }}
          className="mb-4">
          View Detailed Answers
        </Button> */}

        <Button
          mode="outlined"
          onPress={() => {
            router.replace('/(home)');
            router.dismissAll();
          }}>
          Back to Home
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

//</SafeAreaView>
