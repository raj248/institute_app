import { Icon } from '@roninoss/icons';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Platform, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useNotificationStore } from '~/store/notification.store';


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
      <View className="flex-1 p-4">
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
              <View className="mb-3 rounded-xl border border-gray-300 p-4 bg-white dark:bg-zinc-900">
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

              </View>
            )}
          />
        )}
      </View>
    </>
  );
}
