import 'dotenv/config';

export default {
  expo: {
    name: 'FitForge',
    slug: 'fitforge',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.fitforge.app',
      buildNumber: '1.0.0',
      infoPlist: {
        NSFaceIDUsageDescription:
          'FitForge uses Face ID to provide secure and convenient login access to your fitness data.',
        NSCameraUsageDescription:
          'FitForge needs camera access to scan exercise demonstration videos.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1A1A1D',
      },
      package: 'com.fitforge.app',
      versionCode: 1,
      permissions: ['USE_BIOMETRIC', 'USE_FINGERPRINT'],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: '4de5e5f9-b1e5-464f-a936-521bcd967494',
      },
    },
    plugins: [
      'expo-secure-store',
      'expo-local-authentication',
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/Inter-Regular.ttf',
            './assets/fonts/Inter-Bold.ttf',
            './assets/fonts/Inter-SemiBold.ttf',
          ],
        },
      ],
    ],
  },
};
