import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { ThemeToggleSwitch } from '~/components/ThemeToggleSwitch';

export default function HomeTabIndex() {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Text variant="largeTitle" className="pb-4 text-center">
        PJ Classes
      </Text>

      <Text variant="title3" className="text-center pb-2">
        Welcome to your learning dashboard
      </Text>

      <Text variant="subhead" className="text-center pb-8">
        Use the tabs below to navigate between tests, analytics, and settings.
      </Text>

      <ThemeToggleSwitch />
    </View>
  );
}
