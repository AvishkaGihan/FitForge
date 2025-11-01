import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoalSelectionScreen } from '@/screens/onboarding/GoalSelectionScreen';
import { FitnessLevelScreen } from '@/screens/onboarding/FitnessLevelScreen';
import { TimeFrequencyScreen } from '@/screens/onboarding/TimeFrequencyScreen';
import { PreferencesScreen } from '@/screens/onboarding/PreferencesScreen';
import { ProfileSummaryScreen } from '@/screens/onboarding/ProfileSummaryScreen';

const Stack = createNativeStackNavigator();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
      <Stack.Screen name="FitnessLevel" component={FitnessLevelScreen} />
      <Stack.Screen name="TimeFrequency" component={TimeFrequencyScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="ProfileSummary" component={ProfileSummaryScreen} />
    </Stack.Navigator>
  );
}
