import { getOrCreateUserId, getStoredUserId, setStoredUserId } from '~/utils/device-info';
import { registerUser, updateFcmToken } from '~/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '~/stores/user.store';
import { getToken, getMessaging } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';


const app = getApp();
const messaging = getMessaging(app);

/**
 * Get FCM token from localStorage or generate a new one
 */
const FCM_TOKEN_KEY = 'FCM_TOKEN';
const FCM_TOKEN_TIME_KEY = 'FCM_TOKEN_TIME';
const TOKEN_EXPIRY_DAYS = 250;

export async function getFcmToken(): Promise<string | null> {
  try {
    const store = useUserStore.getState();
    const storedToken = store.fcmToken; // ✅ Zustand store
    const storedTimeStr = await AsyncStorage.getItem(FCM_TOKEN_TIME_KEY);
    const storedTime = storedTimeStr ? parseInt(storedTimeStr) : 0;
    const now = Date.now();

    const isExpired = now - storedTime > TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    if (storedToken && !isExpired) {
      console.log('🗃️ Using cached FCM Token:', storedToken);
      return storedToken;
    }

    const newToken = await getToken(messaging);
    if (newToken) {
      console.log('✅ New FCM Token:', newToken);
      await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
      await AsyncStorage.setItem(FCM_TOKEN_TIME_KEY, now.toString());

      // ✅ update Zustand store
      store.setFcmToken(newToken);
    }

    return newToken;
  } catch (error) {
    console.error('❌ Error getting/saving FCM token:', error);
    return null;
  }
}


/**
 * Force-refresh the FCM token (e.g., on user logout or token error)
 */
export async function refreshFcmToken(): Promise<string | null> {
  try {
    await messaging.deleteToken();
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    useUserStore.getState().setFcmToken('');


    const newToken = await getToken(messaging);
    if (newToken) {
      await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
      await AsyncStorage.setItem(FCM_TOKEN_TIME_KEY, Date.now().toString());
      useUserStore.getState().setFcmToken(newToken);
      console.log('🔄 Refreshed FCM Token:', newToken);
    }
    return newToken;
  } catch (error) {
    console.error('❌ Error refreshing FCM token:', error);
    return null;
  }
}

/**
 * Handle FCM token logic + sync to backend
 */
async function handleFcmRegistration() {
  const guestId = await getOrCreateUserId();
  let token = await getFcmToken();
  const store = useUserStore.getState();

  if (!token) return;

  const existingUserId = await getStoredUserId();
  console.log("Existing user ID:", existingUserId);

  if (!existingUserId) {
    console.log("👤 Registering new user...");
    const { success, data } = await registerUser(guestId, 1000, token);

    if (success && data?.data?.id) {
      await setStoredUserId(data.data.id);

      // ✅ update Zustand store
      store.setUserId(data.data.id);
      store.setFcmToken(token);

      console.log("✅ Guest registered & Zustand user store updated:", data.data.id);
    } else {
      console.warn("❌ Failed to register guest user");
    }
  } else {
    const res = await updateFcmToken(existingUserId, token);

    if (res.success) {
      store.setUserId(existingUserId);
      store.setFcmToken(token);
    } else {
      console.warn("❌ Failed to update FCM token, retrying...");
      token = await refreshFcmToken();

      if (token) {
        await updateFcmToken(existingUserId, token);
        store.setFcmToken(token); // ✅ update token in Zustand
      }
    }
  }
}


