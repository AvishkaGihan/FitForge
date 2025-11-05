import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWorkout } from '@/hooks/useWorkout';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function ActiveWorkoutScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { workoutId } = route.params as { workoutId: string };
  const { workout, loading, completeWorkout } = useWorkout(workoutId);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isResting && timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
    return undefined;
  }, [isResting, timer]);

  if (loading || !workout) {
    return <LoadingSpinner />;
  }

  const currentExercise = workout!.exercises[currentExerciseIndex];
  const progress = (currentExerciseIndex + 1) / workout!.exercises.length;

  function handleCompleteSet() {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setTimer(currentExercise.rest);
    } else {
      handleNextExercise();
    }
  }

  function handleNextExercise() {
    if (currentExerciseIndex < workout!.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      handleFinishWorkout();
    }
  }

  async function handleFinishWorkout() {
    Alert.alert('Complete Workout?', 'Are you ready to finish this workout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Finish',
        onPress: async () => {
          try {
            await completeWorkout('Great workout!', timeElapsed);
            const nav = navigation.navigate as (name: string, params: unknown) => void;
            nav('WorkoutComplete', { sessionId: 'temp' });
          } catch {
            Alert.alert('Error', 'Failed to complete workout');
          }
        },
      },
    ]);
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Active Workout</Text>
        <Text style={[styles.timer, { color: colors.textSecondary }]}>
          {formatTime(timeElapsed)}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Exercise {currentExerciseIndex + 1} of {workout!.exercises.length}
        </Text>
        <ProgressBar progress={progress} height={8} style={{ marginTop: 8 }} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {isResting ? (
          <View style={styles.restContainer}>
            <MaterialCommunityIcons name="pause-circle" size={80} color={colors.accent} />
            <Text style={[styles.restTitle, { color: colors.text }]}>Rest Time</Text>
            <Text style={[styles.restTimer, { color: colors.accent }]}>{timer}s</Text>
            <Text style={[styles.nextExercise, { color: colors.textSecondary }]}>
              Next:{' '}
              {currentSet < currentExercise.sets ? 'Set ' + (currentSet + 1) : 'Next Exercise'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.exerciseName, { color: colors.text }]}>
              {currentExercise.name}
            </Text>

            <View style={styles.setInfo}>
              <Text style={[styles.setLabel, { color: colors.textSecondary }]}>
                Set {currentSet} of {currentExercise.sets}
              </Text>
              <Text style={[styles.repsInfo, { color: colors.text }]}>{currentExercise.reps}</Text>
            </View>

            {currentExercise.notes && (
              <View style={[styles.notesCard, { backgroundColor: colors.surface }]}>
                <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
                <Text style={[styles.notes, { color: colors.textSecondary }]}>
                  {currentExercise.notes}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={currentSet < currentExercise.sets ? 'Complete Set' : 'Next Exercise'}
          onPress={handleCompleteSet}
          size="large"
        />
        <Button title="Finish Early" onPress={handleFinishWorkout} variant="outline" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  timer: {
    fontSize: 16,
    fontFamily: 'monospace',
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  restContainer: {
    alignItems: 'center',
  },
  restTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  restTimer: {
    fontSize: 64,
    fontWeight: '700',
    marginTop: 16,
  },
  nextExercise: {
    fontSize: 16,
    marginTop: 16,
  },
  exerciseName: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  setInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  setLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  repsInfo: {
    fontSize: 48,
    fontWeight: '700',
  },
  notesCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  notes: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    padding: 24,
    gap: 12,
  },
});
