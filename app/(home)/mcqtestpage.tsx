import { Drawer } from 'react-native-drawer-layout'
import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, RadioButton, Drawer as PaperDrawer } from 'react-native-paper';
import { useColorScheme } from '~/lib/useColorScheme';
import { Stack } from 'expo-router';
interface Question {
  id: string;
  question: string;
  options: { [key: string]: string };
}

const mockMcqs: Question[] = [
  { id: '1', question: 'Which accounting standard deals with revenue recognition?', options: { a: 'AS 9', b: 'AS 10', c: 'AS 6', d: 'AS 13' } },
  { id: '2', question: 'Which of the following is a direct tax?', options: { a: 'GST', b: 'Income Tax', c: 'Customs Duty', d: 'Excise Duty' } },
  { id: '3', question: 'What is the break-even point?', options: { a: 'Where profit is maximum', b: 'Where total cost equals total revenue', c: 'Where marginal cost equals marginal revenue', d: 'Where sales are zero' } },
  { id: '4', question: 'Who is responsible for the preparation of audit reports?', options: { a: 'Accountant', b: 'Auditor', c: 'Manager', d: 'Board of Directors' } },
  { id: '5', question: 'What is capital budgeting?', options: { a: 'Budget for daily expenses', b: 'Long-term investment decision making', c: 'Budget for salaries', d: 'Budget for repairs' } },
];


export default function McqTestPage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [visited, setVisited] = useState<string[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(60 * 30);
  const { colors } = useColorScheme();
  useEffect(() => {
    const timer = setInterval(() => setRemainingTime(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion = mockMcqs[currentIndex];

  const handleSelectOption = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    if (!visited.includes(currentQuestion.id)) setVisited(prev => [...prev, currentQuestion.id]);
  };

  const handleNext = () => {
    if (!visited.includes(currentQuestion.id)) setVisited(prev => [...prev, currentQuestion.id]);
    if (currentIndex < mockMcqs.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (!visited.includes(currentQuestion.id)) setVisited(prev => [...prev, currentQuestion.id]);
    if (currentIndex < mockMcqs.length - 1 && currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };
  const handleEndTest = () => {
    setDialogVisible(false);
  };

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${('0' + (sec % 60)).slice(-2)}`;

  return (

    <Drawer
      open={drawerVisible}
      onOpen={() => setDrawerVisible(true)}
      onClose={() => setDrawerVisible(false)}
      drawerPosition="right"
      drawerStyle={{ width: '60%' }}
      renderDrawerContent={() => {
        return (
          <SafeAreaView style={{ backgroundColor: colors.background }} className='flex-1'>
            {mockMcqs.map((item, index) => {
              let color = visited.includes(item.id)
                ? answers[item.id]
                  ? 'green'
                  : 'red'
                : 'grey';

              return (
                <PaperDrawer.Item
                  key={item.id}
                  label={`${index + 1}. ${item.question}`}
                  // labelStyle={{ color }}
                  onPress={() => {
                    setDrawerVisible(false);
                    setCurrentIndex(index);
                    setVisited(prev => [...prev, item.id]);
                    // setAnswers();
                  }}
                />
              );
            })}

            <PaperDrawer.Item
              icon="exit-to-app"
              label="End Test"
              onPress={() => setDialogVisible(true)}
            />
          </SafeAreaView>

        )
      }}
    >
      <SafeAreaView className="flex-1">
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
              alert(`Visited: ${visited.length}/${mockMcqs.length}\nAttempted: ${Object.keys(answers).length}`);
            }}
            icon="information"
          >
            Info
          </Button>
          <Text variant="heading">Remaining Time: {formatTime(remainingTime)}</Text>
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
            <Text variant="title2">Q{currentIndex + 1}. {currentQuestion.question}</Text>
            <RadioButton.Group onValueChange={handleSelectOption} value={answers[currentQuestion.id] || ''}>
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <RadioButton.Item key={key} label={value} value={key} />
              ))}
            </RadioButton.Group>
          </View>
          <View className="flex-row justify-between items-center mx-1 mb-4">
            <Button onPress={handlePrevious} icon="arrow-left">Previous</Button>
            <Button mode="outlined" onPress={() => handleSelectOption('')}>Clear</Button>
            <Button onPress={handleNext} icon="arrow-right" contentStyle={{ flexDirection: 'row-reverse' }}>Next</Button>
          </View>
        </ScrollView>
      </SafeAreaView>

    </Drawer>
  )
}