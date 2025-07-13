// firebase/notificationService.ts

import { Alert, PermissionsAndroid } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  setBackgroundMessageHandler,
  requestPermission,
  AuthorizationStatus,
  FirebaseMessagingTypes
} from '@react-native-firebase/messaging';

const app = getApp();
const messaging = getMessaging(app);

/**
 * ✅ GLOBAL: Background message handler for data-only payloads
 * Must be outside any function/component.
 */
setBackgroundMessageHandler(messaging, async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  console.log('📩 [Background Handler] Notification:', remoteMessage);
  // Here you can trigger a local notification using notifee/react-native-push-notification if desired
});

/**
 * Request notification permissions and get FCM token
 */

const requestNotificationPermission = async () => {
 const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
 if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  console.log("Notification permission granted");
 } else {
  console.log("Notification permission denied")
 }
}
export async function requestUserPermission() {
  await requestNotificationPermission();
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('✅ Authorization status:', authStatus);
    await getFcmToken();
    await subscribeToAllDevicesTopic(); // <-- Add this
  } else {
    Alert.alert('Notification Permission', 'Permission denied. Notifications will not work.');
  }
}

/**
 * Retrieve and print FCM token
 */
export async function getFcmToken() {
  try {
    const token = await getToken(messaging);
    console.log('✅ FCM Token:', token);
    return token;
    // TODO: Send token to your backend
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
  }
}

/**
 * Set up notification listeners for foreground, background, and quit state
 */
export function notificationListener() {
  // Foreground notifications
  onMessage(messaging, async remoteMessage => {
    console.log('📩 [Foreground] Notification:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title ?? '',
      remoteMessage.notification?.body ?? ''
    );
  });

  // Background (tap)
  onNotificationOpenedApp(messaging, remoteMessage => {
    console.log('📩 [Opened from Background] Notification:', remoteMessage.notification);
    // Handle navigation here if needed
  });

  // Quit (tap)
  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) {
      console.log('📩 [Opened from Quit] Notification:', remoteMessage.notification);
      // Handle navigation here if needed
    }
  });
}

export async function subscribeToAllDevicesTopic() {
  try {
    await messaging.subscribeToTopic('all-devices');
    console.log('✅ Subscribed to "all-devices" topic');
  } catch (error) {
    console.error('❌ Error subscribing to "all-devices" topic:', error);
  }
}