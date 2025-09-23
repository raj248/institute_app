import { Icon } from '@roninoss/icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useNotificationStore } from '~/stores/notification.store';

export default function NotificationsScreen() {
  const { colors, colorScheme } = useColorScheme();
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
        animated={true}
        backgroundColor={colors.background}
      />
      <SafeAreaView
        className="mx-2 flex-1"
        style={{ backgroundColor: colors.background }}
        edges={['top', 'left', 'right']}>
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
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.messageId}
            ListFooterComponent={() => (
              <Button
                title="Clear Notifications"
                className="mx-auto mb-2 mt-4 rounded-xl border border-gray-300 p-4 text-center"
                style={{ backgroundColor: colors.card, width: '50%' }}
                onPress={() => {
                  Alert.alert(
                    'Clear Notifications',
                    'Are you sure you want to clear all notifications?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Clear',
                        style: 'destructive',
                        onPress: () => useNotificationStore.getState().clearNotifications(),
                      },
                    ],
                    { cancelable: true }
                  );
                }}
                disabled={false}
              />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mb-3 rounded-xl border border-gray-300 p-4"
                style={{ backgroundColor: colors.card }}
                onPress={() => {
                  // Example: route based on notification type
                  if (item.data.type === 'NEW_TEST_PAPER') {
                    router.push({
                      pathname: '/(home)/testlistpage',
                      params: { topicId: item.data.topicId },
                    });
                  } else if (item.data.type === 'NEW_NOTE') {
                    router.push({
                      pathname: '/(home)/pdfviewer',
                      params: { url: item.data.fileUrl, name: item.data.name },
                    });
                  } else if (item.data.type === 'NEWLY_ADDED_ITEM') {
                    router.push({
                      pathname: '/(home)/newlyadded',
                      // params: { url: item.data.fileUrl, name: item.data.name },
                    });
                  } else if (item.data.type === 'NEW_VIDEO_NOTE') {
                    router.push({
                      pathname: '/(home)/videoplayer',
                      params: { url: item.data.fileUrl, title: item.data.name },
                    });
                  } else {
                    Alert.alert('Notification Clicked', 'Fallback Notification Clicked');
                    // router.push('/notifications/detail'); // fallback
                  }
                }}>
                <Text variant="subhead" className="font-semibold">
                  {item.title}
                </Text>
                <Text className="mt-1 text-sm text-zinc-500">{item.body}</Text>
                <Text className="mt-2 text-xs text-zinc-400">
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
