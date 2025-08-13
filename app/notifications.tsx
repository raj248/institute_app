import { Icon } from '@roninoss/icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, Platform, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useNotificationStore } from '~/stores/notification.store';


export default function NotificationsScreen() {
  const { colors, colorScheme } = useColorScheme();
  const notifications = useNotificationStore(state => state.notifications);

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
        animated={true}
        backgroundColor={colors.background}
      />
      <SafeAreaView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-2 px-12">
            <Icon name="bell-outline" size={42} color={colors.grey} />
            <Text variant="title3" className="pb-1 text-center font-semibold">
              No Notifications Yet
            </Text>
            <Text color="tertiary" variant="subhead" className="text-center">
              All your important updates will appear here.
            </Text>
            <Text color="tertiary" variant="subhead" className="text-center">
              Enable notifications to stay updated on new quizzes and announcements.
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.messageId}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mb-3 rounded-xl border border-gray-300 p-4"
                style={{ backgroundColor: colors.card }}
                onPress={() => {
                  // Example: route based on notification type
                  if (item.data.type === 'quiz') {
                    // router.push(`/quiz/${item.targetId}`);
                    Alert.alert('Notification Clicked', 'Quiz Notification Clicked')
                  } else if (item.data.type === 'NEW_NOTE') {
                    router.push({ pathname: '/(home)/pdfviewer', params: { url: item.data.fileUrl, name: item.data.name } });
                  } else {
                    Alert.alert('Notification Clicked', 'Fallback Notification Clicked')
                    // router.push('/notifications/detail'); // fallback
                  }
                }}
              >
                <Text variant="subhead" className="font-semibold">
                  {item.title}
                </Text>
                <Text className="text-sm text-zinc-500 mt-1">
                  {item.body}
                </Text>
                <Text className="text-xs text-zinc-400 mt-2">
                  {new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(item.sentTime))}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </>
  );
}
