import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkoutsListScreen } from '@/screens/workouts/WorkoutsListScreen';
import { ExerciseLibraryScreen } from '@/screens/workouts/ExerciseLibraryScreen';
import { ExerciseDetailScreen } from '@/screens/workouts/ExerciseDetailScreen';
import { WorkoutDetailScreen } from '@/screens/workout/WorkoutDetailScreen';

const Stack = createNativeStackNavigator();

export function WorkoutsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutsList" component={WorkoutsListScreen} />
      <Stack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    </Stack.Navigator>
  );
}
