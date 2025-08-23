import { FlatList, Linking, Pressable, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useEffect, useState } from 'react';
import * as Application from 'expo-application';
import { getStoredUserId } from '~/utils/device-info';
import { SafeAreaView } from 'react-native-safe-area-context';

const items = [
  { label: 'Contact Us', url: 'mailto:support@example.com' },
  { label: 'Rate Us', url: 'https://play.google.com/store/apps/details?id=com.example.app' },
  { label: 'FAQ', url: 'https://example.com/faq' },
  { label: 'Privacy Policy', url: 'https://example.com/privacy' },
  { label: 'Your ID', isStatic: true },
  { label: 'App Version', isStatic: true },
];

export default function Settings() {
  const [guestId, setGuestId] = useState<string>('');
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    getStoredUserId().then((id) => setGuestId(id ?? 'Loading...'));
    setAppVersion(Application.nativeApplicationVersion ?? '1.0.0');
  }, []);

  return (
    <SafeAreaView className="flex-1 p-6">
      <FlatList
        data={items}
        keyExtractor={(item) => item.label}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => {
          const containerStyles = 'rounded-lg border border-gray-300 p-4 bg-white';

          if (item.label === 'Your ID') {
            return (
              <View className="mt-1 px-4">
                <Text className="text-base font-semibold">{item.label}</Text>
                <Text className="mt-1 text-sm text-gray-600">{guestId}</Text>
              </View>
            );
          }

          if (item.label === 'App Version') {
            return (
              <View className="mt-1 px-4">
                <Text className="text-base font-semibold">{item.label}</Text>
                <Text className="mt-1 text-sm text-gray-600">{appVersion}</Text>
              </View>
            );
          }

          return (
            <Pressable
              onPress={() => Linking.openURL(item.url ?? '')}
              className={containerStyles}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Text className="text-base font-semibold text-blue-600">{item.label}</Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
