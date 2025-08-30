import { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';

type ButtonProps = {
  title?: string;
  icon?: string;
  valid?: boolean;
  fontSize?: number;
  color?: string;
  textColor?: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  (
    { title, icon, color, textColor = 'white', valid = false, fontSize = 18, ...touchableProps },
    ref
  ) => {
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        style={[
          touchableProps.style,
          {
            alignItems: 'center',
            backgroundColor: color ? color : valid ? '#ccc' : '#3f3d91',
            borderRadius: 14,
            elevation: 2,
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 16,
          },
        ]}>
        {icon && <Icon size={24} color="white" source={icon} />}
        <Text
          className={cn('text-center', icon ? 'ml-2' : '')}
          style={{ fontSize: fontSize, color: textColor }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
