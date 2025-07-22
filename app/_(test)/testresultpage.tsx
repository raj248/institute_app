import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/nativewindui/Text";
import { ActivityIndicator, Button, Card } from "react-native-paper";
import { useColorScheme } from "~/lib/useColorScheme";
import { router, Stack, useNavigation } from "expo-router";
import { useState, useEffect, use } from "react";
import { useTestStore } from "~/store/test.store";
import { MCQAnswerExplanation } from "~/types/entities";
import { getAnswersForTestPaper } from "~/lib/api";

// ✅ Dummy test result data
const dummyData = {
  testPaperId: "test123",
  answers: {
    "q1": "a",
    "q2": "b",
    "q3": "a",
    "q4": "d",
    "q5": "a",
  },
  mcqs: [
    {
      id: "q1",
      question: "What is React Native?",
      options: { a: "Framework", b: "Language", c: "IDE", d: "Database" },
      correctAnswer: "a",
      explanation: "React Native is a JavaScript framework for building native apps.",
    },
    {
      id: "q2",
      question: "Which language is used by React Native?",
      options: { a: "Python", b: "JavaScript", c: "Java", d: "Swift" },
      correctAnswer: "b",
      explanation: "React Native uses JavaScript under the hood.",
    },
    {
      id: "q3",
      question: "What does JSX stand for?",
      options: { a: "Java Syntax", b: "JSON XML", c: "JavaScript XML", d: "Java XML" },
      correctAnswer: "c",
      explanation: "JSX stands for JavaScript XML.",
    },
    {
      id: "q4",
      question: "Who developed React Native?",
      options: { a: "Google", b: "Microsoft", c: "Amazon", d: "Facebook" },
      correctAnswer: "d",
      explanation: "React Native was developed by Facebook.",
    },
    {
      id: "q5",
      question: "Which command runs a React Native app?",
      options: { a: "npx react-native run-android", b: "npm start", c: "npm install", d: "npm build" },
      correctAnswer: "a",
      explanation: "The correct command is `npx react-native run-android`.",
    },
  ],
};




export default function TestResultPage() {
  const navigation = useNavigation();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [correctAnswers, setCorrectAnswers] = useState<MCQAnswerExplanation[]>();
  const { testData, answers } = useTestStore(state => ({
    testData: state.testData,
    answers: state.answers,
  }));

  const getAnswers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnswersForTestPaper(testData?.id ?? "")
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      else if (res.data) {
        setCorrectAnswers(res.data);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to load test. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAnswers();
  }, []);

  const [score, setScore] = useState(0);
  const total = testData?.totalMarks;

  useEffect(() => {
    if (!testData?.mcqs) return;
    let calculatedScore = 0;
    correctAnswers?.forEach((mcq) => {
      if (answers[mcq.id] === mcq.answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
  }, [correctAnswers]);

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
          onPress={getAnswers}
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
        <Text className="text-center">No test or MCQs found.</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 px-4" style={{ backgroundColor: colors.background }}>
      <Stack.Screen options={{
        title: testData.name,
        animation: "simple_push",
        autoHideHomeIndicator: true,
        headerShown: true,
      }}
      />

      {/* Score Display */}
      <View className="items-center mt-6 mb-4 justify-center">
        <Text style={{ color: colors.primary }} variant={"largeTitle"}>
          {score}
        </Text>
        <Text variant={"subhead"}>
          out of {total}
        </Text>
      </View>

      {/* Results List */}
      <FlatList
        data={testData.mcqs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const selected = answers[item.id];
          const correctAnswer = correctAnswers?.find(mcq => mcq.id === item.id)?.answer;
          const isCorrect = selected === correctAnswer;

          return (
            <Card
              style={{
                marginVertical: 8,
                backgroundColor: isDarkColorScheme ? "#222" : "#fff",
              }}
            >
              <Card.Content>
                <Text style={{ fontWeight: "600", marginBottom: 4 }}>
                  {item.question}
                </Text>

                {Object.entries(item.options).map(([key, value]) => (
                  <Text
                    key={key}
                    style={{
                      color:
                        key === correctAnswer
                          ? "green"
                          : key === selected
                            ? isCorrect
                              ? "green"
                              : "red"
                            : colors.foreground,
                      fontWeight: key === selected ? "bold" : "normal",
                    }}
                  >
                    {key.toUpperCase()}. {value}
                  </Text>
                ))}

                <Text
                  style={{
                    marginTop: 6,
                    color: isDarkColorScheme ? "#ccc" : "#555",
                    fontStyle: "italic",
                  }}
                >
                  Explanation: {correctAnswers?.find(mcq => mcq.id === item.id)?.explanation}
                </Text>
              </Card.Content>
            </Card>
          );
        }}
      />


      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={{ marginVertical: 12 }}
      >
        Done
      </Button>
    </SafeAreaView>
  );
}
