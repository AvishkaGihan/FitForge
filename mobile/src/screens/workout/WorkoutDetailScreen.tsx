import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWorkout } from '@/hooks/useWorkout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { formatDuration } from '@/utils/helpers';

export function WorkoutDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { workoutId } = route.params as { workoutId: string };
  const { workout, loading, error, loadWorkout } = useWorkout();

  useEffect(() => {
    if (workoutId) {
      loadWorkout(workoutId);
    }
  }, [workoutId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !workout) {
    return (
      <ErrorMessage message={error || 'Workout not found'} onRetry={() => loadWorkout(workoutId)} />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Workout Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>
          <View style={styles.metaRow}>
            <Badge label={workout.difficulty} difficulty={workout.difficulty} />
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {formatDuration(workout.estimated_duration)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="dumbbell" size={18} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {workout.exercises?.length || 0} exercises
              </Text>
            </View>
          </View>
        </View>

        {/* Exercises List */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
        {workout.exercises?.map((exercise, index) => (
          <Card key={index} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={[styles.exerciseNumber, { color: colors.primary }]}>{index + 1}</Text>
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
                <Text style={[styles.exerciseDetails, { color: colors.textSecondary }]}>
                  {exercise.sets} sets × {exercise.reps}
                </Text>
                {exercise.rest > 0 && (
                  <Text style={[styles.restTime, { color: colors.textSecondary }]}>
                    Rest: {exercise.rest}s
                  </Text>
                )}
              </View>
            </View>
            {exercise.notes && (
              <Text style={[styles.exerciseNotes, { color: colors.textSecondary }]}>
                💡 {exercise.notes}
              </Text>
            )}
          </Card>
        ))}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        <Button
          title="Start Workout"
          onPress={() => (navigation as any).navigate('ActiveWorkout', { workoutId: workout.id })}
          size="large"
        />
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  workoutName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  exerciseCard: {
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseNumber: {
    fontSize: 20,
    fontWeight: '700',
    width: 32,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  restTime: {
    fontSize: 12,
  },
  exerciseNotes: {
    fontSize: 13,
    marginTop: 8,
    paddingLeft: 44,
    lineHeight: 18,
  },
  footer: {
    padding: 24,
  },
});
