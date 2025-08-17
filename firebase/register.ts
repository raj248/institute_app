import { getOrCreateUserId, getStoredUserId, setStoredPhoneNumber, setStoredUserId } from '~/utils/device-info';
import { registerUser } from '~/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '~/stores/user.store';
import { getToken, getMessaging } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

export async  function register(phoneNumber: number){
  const id = await getOrCreateUserId();

  const { success, error, data } = await registerUser(id, phoneNumber);
  if (success && data) {
    useUserStore.getState().setUserId(data.userId);
    useUserStore.getState().setPhoneNumber(data.phoneNumber);
    await setStoredUserId(id);
    await setStoredPhoneNumber(phoneNumber.toString());
    console.log('User registered successfully:', data)
  } else {
    console.error('Error registering user:', error);
  }
  return { success, error, data };
}

