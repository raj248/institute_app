import React from 'react';
import Animated, { useSharedValue, useDerivedValue, withTiming, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useColorScheme } from '~/lib/useColorScheme';
import { COLORS } from '~/theme/colors';

export function SmoothThemeTransitionWrapper({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const progress = useSharedValue(colorScheme === 'dark' ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(colorScheme === 'dark' ? 1 : 0, { duration: 300 });
  }, [colorScheme]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.background, COLORS.dark.background]
    );
    return { flex: 1, backgroundColor };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
