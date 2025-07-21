import { View, Image } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { ThemeToggleSwitch } from '~/components/ThemeToggleSwitch';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileTab() {
  const { colors } = useColorScheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?u=pj_clakdjfsss' }}
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
      <Text variant="subhead" className="pb-8 text-center">
        Manage your account, preferences, and theme here.
      </Text>
      <ThemeToggleSwitch />
    </SafeAreaView>
  );
}
