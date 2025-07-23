export default {
  "expo": {
    "name": "pj-classes-app",
    "slug": "pj-classes-app",
    "version": "1.0.0",
    "scheme": "pj-classes-app",
    "orientation": "default",
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-dev-launcher",
        {
          "launchMode": "most-recent"
        }
      ],
      "expo-web-browser",
      "@config-plugins/react-native-pdf",
      "@config-plugins/react-native-blob-util"
    ],
    "experiments": {
      "typedRoutes": true,
      "tsconfigPaths": true
    },
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.pjclasses.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.pjclasses.app",
      "googleServicesFile": process.env.GOOGLE_SERVICES_FILE,
      "useNextNotificationsApi": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "a15a8433-d87a-403f-88cc-9f50f4290850"
      }
    }
  }
}
