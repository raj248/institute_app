import { forwardRef } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

type ButtonProps = {
  title?: string;
  icon?: string;
  valid?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, icon, valid, ...touchableProps }, ref) => {
  const { colors } = useColorScheme();
  return (
    <TouchableOpacity ref={ref} {...touchableProps} style={[touchableProps.style, {
      alignItems: 'center',
      backgroundColor: valid ? '#ccc' : '#1081ddff',
      borderRadius: 14,
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        height: 2,
        width: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    }]}>
      {icon && <Icon size={24} color={colors.foreground} source={icon} />}
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';