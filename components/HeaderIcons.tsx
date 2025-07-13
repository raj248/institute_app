import { Icon } from '@roninoss/icons';
import { Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/cn';

export default function HeaderIcons() {
  const { colors } = useColorScheme();

  return (
    <View className="flex flex-row items-center space-x-3 pr-3 gap-2">
      <Link href="/notifications" asChild>
        <Pressable className="opacity-80">
          {({ pressed }) => (
            <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
              <Icon name="bell-outline" size={22} color={colors.foreground} />
            </View>
          )}
        </Pressable>
      </Link>
      <Link href="/modal" asChild>
        <Pressable className="opacity-80">
          {({ pressed }) => (
            <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
              <Icon name="cog-outline" size={22} color={colors.foreground} />
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
}

