export const unstable_settings = {
  initialRouteName: "(home)",
  exclude: ["_(test)"],
};

import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "~/lib/useColorScheme";
import HeaderIcons from "~/components/HeaderIcons";

export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const segments = useSegments();

  const hideTabBar = segments[0] === "_(test)";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: hideTabBar ? {
          display: "none",
        } : {
          backgroundColor: colorScheme === "dark" ? "#222" : "#fff",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarInactiveBackgroundColor: colorScheme === "dark" ? "#222" : "#fff",
        tabBarActiveBackgroundColor: colorScheme === "dark" ? "#333" : "#fff",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#aaa" : "#555",
        tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#000",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 12 },
        // tabBarShowLabel: false,
        // tabBarVariant: "material",
        // tabBarPosition: "left",
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="_(test)"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
          animation: 'shift',
        }}
      />

    </Tabs>
  );
}
