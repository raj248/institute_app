import React from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/cn';

interface CardButtonProps {
  icon: any; // require('...') or { uri: '...' }
  title: string;
  description: string;
  onPress: () => void;
}

export const CardButton: React.FC<CardButtonProps> = ({ icon, title, description, onPress }) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-1 items-center justify-center rounded-xl p-4',
        'shadow-md dark:shadow-lg',
        isDarkColorScheme ? 'bg-gray-800' : 'bg-white'
      )}
      android_ripple={{ color: isDarkColorScheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
      <Image source={icon} className="mb-2 h-16 w-16" resizeMode="contain" />
      <Text
        className={cn(
          'text-center text-base font-semibold',
          isDarkColorScheme ? 'text-white' : 'text-gray-800'
        )}
        style={{ fontSize: 18 }}>
        {title}
      </Text>
      <Text
        className={cn(
          'mt-1 text-center text-xs',
          isDarkColorScheme ? 'text-gray-300' : 'text-gray-500'
        )}
        style={{ fontSize: 14 }}>
        {description}
      </Text>
    </Pressable>
  );
};
