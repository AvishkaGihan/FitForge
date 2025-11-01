import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

import { SplashScreen } from '../screens/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { storage } from '@/utils/storage';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    checkOnboarding();
  }, [isAuthenticated]);

  async function checkOnboarding() {
    if (isAuthenticated) {
      const complete = await storage.isOnboardingComplete();
      setOnboardingComplete(complete);
    }
  }

  if (loading || (isAuthenticated && onboardingComplete === null)) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : !onboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
