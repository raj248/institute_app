import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const unstable_settings = {
  initialRouteName: '(home)',
  exclude: ['_(test)'],
};

import { Tabs, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

import HomeIcon from '../assets/svg/home';
import SearchIcon from '../assets/svg/search';
import NotificationIcon from '../assets/svg/notification';
import ProfileIcon from '../assets/svg/profile';
import { TouchableOpacity } from 'react-native';

const NoRippleButton = ({ children, onPress, style }: any) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>
    {children}
  </TouchableOpacity>
);

export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const segments = useSegments();

  const hideTabBar = segments[0] === '_(test)';
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: hideTabBar
          ? {
              display: 'none',
            }
          : {
              paddingBottom: insets.bottom,
              height: 65 + insets.bottom,
              backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
              elevation: 5,
              shadowColor: '#000',
              shadowOpacity: 0,
            },
        tabBarIconStyle: { marginVertical: 2.5, marginTop: 5 },
        tabBarInactiveBackgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
        tabBarActiveBackgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#aaa' : '#555',
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 12, marginTop: -2 },
        // tabBarShowLabel: false,
        // tabBarVariant: "material",
        // tabBarPosition: "left",
        tabBarButton: (props) => <NoRippleButton {...props} />,
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          // tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          tabBarIcon: ({ color, size, focused }) => (
            <HomeIcon color={color} width={size} height={size} focused={focused} />
          ),
          animation: 'shift',
          headerStyle: {
            backgroundColor: '#444',
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <SearchIcon color={color} width={size} height={size} focused={focused} />
          ),
          animation: 'shift',
          headerStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size, focused }) => (
            <NotificationIcon color={color} width={size} height={size} focused={focused} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <ProfileIcon color={color} width={size} height={size} focused={focused} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="_(test)"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
          animation: 'shift',
        }}
      />
    </Tabs>
  );
}
