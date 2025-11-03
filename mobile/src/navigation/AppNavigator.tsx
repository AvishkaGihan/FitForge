import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';

import { SplashScreen } from '@/screens/SplashScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { GoalSelectionScreen } from '@/screens/onboarding/GoalSelectionScreen';
import { FitnessLevelScreen } from '@/screens/onboarding/FitnessLevelScreen';
import { TimeFrequencyScreen } from '@/screens/onboarding/TimeFrequencyScreen';
import { PreferencesScreen } from '@/screens/onboarding/PreferencesScreen';
import { ProfileSummaryScreen } from '@/screens/onboarding/ProfileSummaryScreen';
import { MainNavigator } from './MainNavigator';
import { storage } from '@/utils/storage';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = React.useState<boolean | null>(null);
  const [showSplash, setShowSplash] = React.useState(true);
  const navigationRef = React.useRef<any>(null);

  React.useEffect(() => {
    checkOnboarding();
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (!loading) {
      const splashTimer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(splashTimer);
    }
    return undefined;
  }, [loading]);

  React.useEffect(() => {
    if (!showSplash && navigationRef.current) {
      setTimeout(() => {
        try {
          if (!isAuthenticated) {
            navigationRef.current.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } else if (!onboardingComplete) {
            navigationRef.current.reset({
              index: 0,
              routes: [{ name: 'GoalSelection' }],
            });
          } else {
            navigationRef.current.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          }
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }, 100);
    }
  }, [showSplash, isAuthenticated, onboardingComplete]);

  async function checkOnboarding() {
    if (isAuthenticated) {
      const complete = await storage.isOnboardingComplete();
      setOnboardingComplete(complete);
    } else {
      setOnboardingComplete(null);
    }
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
        <Stack.Screen name="FitnessLevel" component={FitnessLevelScreen} />
        <Stack.Screen name="TimeFrequency" component={TimeFrequencyScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="ProfileSummary" component={ProfileSummaryScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
