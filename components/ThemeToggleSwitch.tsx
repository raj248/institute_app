import React from 'react';
import Animated, { LayoutAnimationConfig, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import { Pressable, Text, View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { COLORS } from '~/theme/colors';
// import { Icon } from 'react-native-paper';
import { Octicons } from '@expo/vector-icons';


export function ThemeToggleSwitch() {
  const { colorScheme, toggleColorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        className="items-center justify-center"
        key={`toggle-switch-${colorScheme}`}
      // entering={SlideInLeft}
      >
        <Pressable
          onPress={toggleColorScheme}
          style={{
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            backgroundColor: isDarkColorScheme ? "#333" : "#ddd",
            borderRadius: 20,
            width: 50,
            height: 20,
          }}
        >

          {!isDarkColorScheme && (
            <Text
              style={{
                color: COLORS.light.foreground,
                fontSize: 12,
                fontWeight: '100',
                marginLeft: 3,
              }}
            >
              Light
            </Text>
          )}

          <View
            style={{
              backgroundColor: isDarkColorScheme ? COLORS.light.grey4 : COLORS.light.grey6,
              width: 15,
              height: 15,
              borderRadius: 7,
              borderWidth: 1,
              borderColor: isDarkColorScheme ? "#bbb" : "#ccc",
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* <Icon source={isDarkColorScheme ? 'moon.stars' : 'sun'} size={20} color={isDarkColorScheme ? COLORS.light.foreground : COLORS.dark.foreground} /> */}
            <Octicons name={isDarkColorScheme ? 'moon' : 'sun'} size={10} color={isDarkColorScheme ? COLORS.light.foreground : COLORS.dark.background} />

          </View>

          {isDarkColorScheme && (
            <Text
              style={{
                color: COLORS.dark.foreground,
                fontSize: 12,
                fontWeight: '100',
                marginRight: 3,
              }}
            >
              Dark
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </LayoutAnimationConfig>
  );
}
