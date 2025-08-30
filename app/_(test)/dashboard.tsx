import { View, Image, Platform } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { MD2LightTheme, MD3DarkTheme, TextInput } from 'react-native-paper';
import { useLayoutEffect, useState } from 'react';
import { router, Stack, useNavigation } from 'expo-router';
import { Button } from '~/components/Button';
import { register } from '~/firebase/register';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function HomeTabIndex() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }, [navigation]);

  const { colors, isDarkColorScheme } = useColorScheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handler = async () => {
    const user = await register(Number(phoneNumber));
    if (user.success && user.data) {
      router.replace('/(home)');
    } else {
      setError('Error registering user. Please try again. ' + user.error);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      enableOnAndroid={true}
      extraScrollHeight={20} // small extra space above keyboard
      // keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={require('~/assets/dashboard-icon.png')}
        style={{ width: 150, height: 150, marginBottom: 24 }}
        resizeMode="contain"
      />

      <Text variant="largeTitle" className="pb-4 text-center">
        CA Parveen Jindal Classes
      </Text>
      <Text variant="title3" className="pb-2 text-center">
        Welcome to your learning dashboard
      </Text>
      <Text variant="subhead" className="pb-8 text-center">
        Enter your phone number to continue to your personalized learning dashboard.
      </Text>

      <TextInput
        label="Phone Number"
        mode="outlined"
        keyboardType="numeric"
        maxLength={10}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        style={{ width: '100%' }}
        theme={isDarkColorScheme ? MD3DarkTheme : MD2LightTheme}
      />

      {error && (
        <Text variant="callout" className="pt-4 text-center text-red-500">
          {error}
        </Text>
      )}

      <Button
        title="Get Started"
        onPress={handler}
        icon="arrow-right"
        valid={phoneNumber.length < 10}
        disabled={phoneNumber.length < 10}
        className="mt-8 w-[80%]"
      />
    </KeyboardAwareScrollView>
  );
}
