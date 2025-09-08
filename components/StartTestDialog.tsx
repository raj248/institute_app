// start test dialog. takes a test and open state
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { TestPaper } from '~/types/entities';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';
import { Button } from './Button';

interface StartTestDialogProps {
  visible: boolean;
  onDismiss: () => void;
  test: TestPaper | null;
}

export default function StartTestDialog({ visible, onDismiss, test }: StartTestDialogProps) {
  const { colors, isDarkColorScheme } = useColorScheme();

  if (!test) return null;

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: colors.background, borderRadius: 8, maxHeight: '80%' }} // limit dialog height
      >
        <Dialog.Title style={{ color: colors.foreground, textAlign: 'center' }}>
          {test.name}
        </Dialog.Title>

        {/* Scrollable content */}
        <Dialog.Content style={{ paddingHorizontal: 0 }}>
          <ScrollView
            style={{ maxHeight: 300 }} // adjust max height to control scroll area
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16 }}
            showsVerticalScrollIndicator>
            <View className="mb-4">
              {test.description && (
                <Text className="mb-2 text-center">
                  <Text className="font-bold">Description:</Text> {test.description}
                </Text>
              )}
              {test.timeLimitMinutes && (
                <Text className="mb-2 text-center">
                  <Text className="font-bold">Time Limit:</Text> {test.timeLimitMinutes} minutes
                </Text>
              )}
              {test.totalMarks && (
                <Text className="mb-2 text-center">
                  <Text className="font-bold">Total Marks:</Text> {test.totalMarks}
                </Text>
              )}
              {test.mcqCount && (
                <Text className="text-center">
                  <Text className="font-bold">Number of Questions:</Text> {test.mcqCount}
                </Text>
              )}
            </View>
          </ScrollView>
        </Dialog.Content>

        <Dialog.Actions className="flex-row space-x-2">
          <Button
            title="Cancel"
            textColor={colors.foreground}
            onPress={onDismiss}
            valid={true}
            elevation={0}
            className="flex-1"
          />
          <Button
            title="Start Test"
            textColor={isDarkColorScheme ? '#000' : '#fff'}
            onPress={() => {
              onDismiss();
              router.push({
                pathname: `../_(test)/quiz`,
                params: { testId: test.id, date: new Date().toISOString() },
              });
            }}
            elevation={0}
            className="flex-1"
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
