import { Image } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '~/stores/user.store';
import * as Application from 'expo-application';
import { useEffect, useState } from 'react';

export default function ProfileTab() {
  const { colors } = useColorScheme();
  const userId = useUserStore.getState().userId;
  const phoneNumber = useUserStore.getState().phoneNumber;

  const seed = `${userId}-${phoneNumber}`; // e.g., your userId/phone
  const style = 'dylan'; // any style name from docs
  const size = 256;
  const uri = `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(userId || seed)}&size=${size}&radius=16`;

  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    setAppVersion(Application.nativeApplicationVersion ?? '1.0.0');
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
      <Image
        // source={{ uri: 'https://i.pravatar.cc/150?u=pj_clakdjfsss' }}
        source={{ uri: uri }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          marginBottom: 16,
        }}
      />
      <Text variant="title2" className="pb-2">
        Your Profile
      </Text>
      <Text variant="subhead" className="pb-2">
        User ID: {userId}
      </Text>
      <Text variant="subhead" className="pb-2">
        Phone Number: {phoneNumber}
      </Text>
      {/* App version */}
      <Text variant="footnote" className="pb-2">
        App Version: {appVersion}
      </Text>
      {/* <ThemeToggleSwitch /> */}
    </SafeAreaView>
  );
}
