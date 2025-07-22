import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View } from "react-native";
import { Text } from "~/components/nativewindui/Text";
import { Button, Card } from "react-native-paper";
import { useColorScheme } from "~/lib/useColorScheme";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";

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
  const { colors, isDarkColorScheme } = useColorScheme();
  const [score, setScore] = useState(0);
  const total = dummyData.mcqs.length;

  useEffect(() => {
    let calculatedScore = 0;
    dummyData.mcqs.forEach((mcq) => {
      if (dummyData.answers[mcq.id] === mcq.correctAnswer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
  }, []);

  return (
    <SafeAreaView className="flex-1 px-4" style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: "Test Results",
          headerShown: true,
        }}
      />

      {/* Score Display */}
      <View className="items-center mt-6 mb-4 justify-center">
        <Text style={{ color: colors.primary }} variant={"largeTitle"}>
          {score}
        </Text>
        <Text style={{ fontSize: 16, color: colors.text }}>
          out of {total}
        </Text>
      </View>

      {/* Results List */}
      <FlatList
        data={dummyData.mcqs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const selected = dummyData.answers[item.id];
          const isCorrect = selected === item.correctAnswer;
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
                        key === item.correctAnswer
                          ? "green"
                          : key === selected
                            ? isCorrect
                              ? "green"
                              : "red"
                            : colors.text,
                      fontWeight: key === selected ? "bold" : "normal",
                    }}
                  >
                    {key.toUpperCase()}. {value}
                  </Text>
                ))}

                <Text style={{ marginTop: 6, color: isDarkColorScheme ? "#ccc" : "#555", fontStyle: "italic" }}>
                  Explanation: {item.explanation}
                </Text>
              </Card.Content>
            </Card>
          );
        }}
      />

      <Button
        mode="contained"
        onPress={() => console.log("Navigate back or share results")}
        style={{ marginVertical: 12 }}
      >
        Done
      </Button>
    </SafeAreaView>
  );
}
