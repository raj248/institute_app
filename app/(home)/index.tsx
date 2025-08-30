import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { Button } from '~/components/Button'; // assuming you have a reusable Button component
import { useRouter } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { useUserStore } from '~/stores/user.store';
import { getStoredPhoneNumber, getStoredUserId } from '~/utils/device-info';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const { colors } = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const phoneNumber = await getStoredPhoneNumber();
      const userId = await getStoredUserId();
      if (!phoneNumber) {
        router.push('/_(test)/dashboard');
        // console.log("No phone number found, redirecting to dashboard")
      } else {
        if (userId) useUserStore.getState().setUserId(userId);
        useUserStore.getState().setPhoneNumber(Number(phoneNumber));
        // console.log("Phone number found, redirecting to testlistpage")
      }
    })();
  }, []);

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center gap-4 px-4"
      style={{
        backgroundColor: '#fbfbfb',
      }}>
      {/* App Icon */}
      <Image
        source={require('~/assets/dashboard-icon.png')} // replace with your actual icon or placeholder
        style={{ width: 150, height: 150, marginBottom: 24 }}
        resizeMode="contain"
      />

      <Button
        fontSize={18}
        title="CA Inter"
        className="mb-4 w-[80%]"
        onPress={() => router.push('/cainter')}
      />

      <Button
        fontSize={18}
        title="CA Final"
        className="w-[80%]"
        onPress={() => router.push('/cafinal')}
      />

      {/* <Button
        title='Debug'
        className="w-[80%]"
        onPress={() => router.push('/debug')}
      /> */}
    </SafeAreaView>
  );
};

export default Home;
