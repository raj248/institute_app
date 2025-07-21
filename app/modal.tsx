import { Icon } from '@roninoss/icons';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

export default function ModalScreen() {
  const { colors, colorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
        animated={true}
        backgroundColor={colors.background}
      />
      <View className="flex-1 items-center justify-center gap-2 px-12">
        <Icon name="cog-outline" size={42} color={colors.grey} />
        <Text variant="title3" className="pb-1 text-center font-semibold">
          Settings
        </Text>
        <Text color="tertiary" variant="subhead" className="text-center">
          All your app settings will appear here.
        </Text>
        <Text color="tertiary" variant="subhead" className="text-center">
          Customize your experience and manage preferences easily.
        </Text>
      </View>
    </>
  );
}
