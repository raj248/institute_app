import { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';

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
    { title, icon, color, textColor = 'white', valid = true, fontSize = 12, ...touchableProps },
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
            backgroundColor: color ? color : valid ? '#3f3d91' : '#1081ddff',
            borderRadius: 14,
            elevation: 2,
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 16,
          },
        ]}>
        {icon && <Icon size={24} color="white" source={icon} />}
        <Text className="ml-2 text-center" style={{ fontSize: fontSize, color: textColor }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
