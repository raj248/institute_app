import { Icon } from '@roninoss/icons';
import { Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/cn';

import SettingIcon from '../assets/svg/setting';
export default function HeaderIcons() {
  const { colors } = useColorScheme();

  return (
    <View className="flex flex-row items-center gap-2 space-x-3 pr-3">
      {/* <ThemeToggleSwitch /> */}
      {/* <Link href="../_(test)/dashboard" asChild>
        <Pressable className="opacity-80">
          {({ pressed }) => (
            <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
              <Icon name="atom" size={26} color={colors.foreground} />
            </View>
          )}
        </Pressable>
      </Link> */}
      <Link href="/modal" asChild>
        <Pressable className="opacity-80">
          {({ pressed }) => (
            <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
              <SettingIcon width={26} height={26} color={colors.foreground} />
              {/* <Icon name="cog-outline" size={26} color={colors.foreground} /> */}
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
}
