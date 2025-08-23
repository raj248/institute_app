import { forwardRef } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

type ButtonProps = {
  title?: string;
  icon?: string;
  valid?: boolean;
  fontSize?: number;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, icon, valid = true, fontSize = 16, ...touchableProps }, ref) => {
    const { colors } = useColorScheme();
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        style={[
          touchableProps.style,
          {
            alignItems: 'center',
            backgroundColor: valid ? '#3f3d91' : '#1081ddff',
            borderRadius: 14,
            elevation: 2,
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 16,
          },
        ]}>
        {icon && <Icon size={24} color="white" source={icon} />}
        <Text className="ml-2" style={{ fontSize: fontSize, color: 'white' }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
