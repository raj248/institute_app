import { Icon } from '@roninoss/icons';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { SmoothThemeTransitionWrapper } from '~/components/ThemeTransitionProvider';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

export default function NotificationsScreen() {
  const { colors, colorScheme } = useColorScheme();

  return (
    <SmoothThemeTransitionWrapper>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
        animated={true}
        backgroundColor={colors.background}
      />
      <View className="flex-1 items-center justify-center gap-2 px-12" >
        <Icon name="bell-outline" size={42} color={colors.grey} />
        <Text variant="title3" className="pb-1 text-center font-semibold">
          Notifications more+
        </Text>
        <Text color="tertiary" variant="subhead" className="text-center">
          All your important updates will appear here.
        </Text>
        <Text color="tertiary" variant="subhead" className="text-center">
          Enable notifications to stay updated on new quizzes and announcements.
        </Text>
      </View>
    </SmoothThemeTransitionWrapper>
  );
}
