import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { WorkoutDetailScreen } from '../screens/workout/WorkoutDetailScreen';
import { ActiveWorkoutScreen } from '../screens/workout/ActiveWorkoutScreen';
import { WorkoutCompleteScreen } from '../screens/workout/WorkoutCompleteScreen';

const Stack = createNativeStackNavigator();

export function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <Stack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} />
    </Stack.Navigator>
  );
}
