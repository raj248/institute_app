console.log('EXPO_PUBLIC_API_SERVER_URL', process.env.EXPO_PUBLIC_API_SERVER_URL);
export default {
  expo: {
    name: 'CA Parveen Jindal Classes',
    slug: 'pj-classes-lms',
    version: '1.1.0',
    scheme: 'pj-classes-lms',
    githubUrl: 'https://github.com/raj248/institute_app',
    orientation: 'default',
    icon: './assets/icon.png',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-dev-launcher',
        {
          launchMode: 'most-recent',
        },
      ],
      'expo-web-browser',
      '@config-plugins/react-native-pdf',
      '@config-plugins/react-native-blob-util',
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.pjclasses.lms',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.pjclasses.lms',
      googleServicesFile: process.env.GOOGLE_SERVICES_FILE,
      useNextNotificationsApi: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '62743823-ad86-4653-9a74-4a87c55e89d2',
      },
    },
  },
};
