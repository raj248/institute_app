import { Alert, AppRegistry, PermissionsAndroid } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  setBackgroundMessageHandler,
  requestPermission,
  AuthorizationStatus,
  FirebaseMessagingTypes,
  subscribeToTopic,
} from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { useNotificationStore } from '~/stores/notification.store';
import { router } from 'expo-router';

const app = getApp();
const messaging = getMessaging(app);

const requestNotificationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Notification permission granted');
    return true;
  } else {
    console.log('Notification permission denied');
    return false;
  }
};

export async function requestUserPermission() {
  await requestNotificationPermission();
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');
  } else {
    Alert.alert('Notification Permission', 'Permission denied. Notifications will not work.');
  }
  return enabled;
}

// Background
setBackgroundMessageHandler(
  messaging,
  async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('📩 [Background Handler] Notification:', remoteMessage);
    useNotificationStore.getState().addNotification({
      messageId: remoteMessage.messageId ?? '',
      title: remoteMessage.notification?.title ?? 'Notification',
      body: remoteMessage.notification?.body ?? '',
      sentTime: remoteMessage.sentTime ?? Date.now(),
      data: remoteMessage.data ?? {},
    });
  }
);

// Foreground/Background/Quit Listeners
export async function notificationListener() {
  await requestUserPermission().then(() => subscribeToAllDevicesTopic());

  onMessage(messaging, async (remoteMessage) => {
    console.log('📩 [Foreground] Notification:', remoteMessage);
    Toast.show({
      type: 'info',
      text1: remoteMessage.notification?.title ?? 'New Notification',
      text2: remoteMessage.notification?.body ?? '',
      position: 'top',
      visibilityTime: 4000,
    });

    useNotificationStore.getState().addNotification({
      messageId: remoteMessage.messageId ?? '',
      title: remoteMessage.notification?.title ?? 'Notification',
      body: remoteMessage.notification?.body ?? '',
      sentTime: remoteMessage.sentTime ?? Date.now(),
      data: remoteMessage.data ?? {},
    });
  });

  onNotificationOpenedApp(messaging, (remoteMessage) => {
    console.log(
      '📩 [Opened from Background] Notification:',
      (remoteMessage.notification as any).data
    );
    // same logic...
    useNotificationStore.getState().addNotification({
      messageId: remoteMessage.messageId ?? '',
      title: remoteMessage.notification?.title ?? 'Notification',
      body: remoteMessage.notification?.body ?? '',
      sentTime: remoteMessage.sentTime ?? Date.now(),
      data: remoteMessage.data ?? {},
    });

    if (remoteMessage.data?.type === 'NEW_TEST_PAPER') {
      router.push({
        pathname: '/(home)/testlistpage',
        params: { topicId: remoteMessage.data?.topicId as string },
      });
    } else if (remoteMessage.data?.type === 'NEW_NOTE') {
      router.push({
        pathname: '/(home)/pdfviewer',
        params: {
          url: remoteMessage.data?.fileUrl as string,
          name: remoteMessage.data?.name as string,
        },
      });
    } else if (remoteMessage.data?.type === 'NEWLY_ADDED_ITEM') {
      router.push({
        pathname: '/(home)/newlyadded',
      });
    } else if (remoteMessage.data?.type === 'NEW_VIDEO_NOTE') {
      router.push({
        pathname: '/(home)/videoplayer',
        params: {
          url: remoteMessage.data?.fileUrl as string,
          title: remoteMessage.data?.name as string,
        },
      });
    } else {
      Alert.alert('Notification Clicked', 'Fallback Notification Clicked');
    }
  });

  getInitialNotification(messaging).then((remoteMessage) => {
    if (remoteMessage) {
      console.log('📩 [Opened from Quit] Notification:', remoteMessage.notification);
      // same logic...
      useNotificationStore.getState().addNotification({
        messageId: remoteMessage.messageId ?? '',
        title: remoteMessage.notification?.title ?? 'Notification',
        body: remoteMessage.notification?.body ?? '',
        sentTime: remoteMessage.sentTime ?? Date.now(),
        data: remoteMessage.data ?? {},
      });

      // Alert.alert(
      //   remoteMessage.notification?.title ?? 'Notification Opened',
      //   remoteMessage.notification?.body ?? 'App was opened from a notification.',
      //   [{ text: 'OK' }]
      // );
    }
  });
}

export async function subscribeToAllDevicesTopic() {
  try {
    await subscribeToTopic(messaging, 'all-devices');
    console.log('✅ Subscribed to "all-devices" topic');
  } catch (error) {
    console.error('❌ Error subscribing to "all-devices" topic:', error);
  }
}
