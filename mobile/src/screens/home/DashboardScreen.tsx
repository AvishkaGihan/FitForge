import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkout } from '@/hooks/useWorkout';
import { useStats } from '@/hooks/useStats';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatDuration } from '@/utils/helpers';

export function DashboardScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { workout, loading: workoutLoading, generateWorkout } = useWorkout();
  const { stats, refresh: refreshStats } = useStats();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await refreshStats();
    setRefreshing(false);
  }

  async function handleGenerateWorkout() {
    try {
      await generateWorkout();
    } catch (error) {
      console.error('Failed to generate workout:', error);
    }
  }

  if (workoutLoading && !workout) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.email?.split('@')[0] || 'User'}!
            </Text>
          </View>
          <Avatar name={user?.email} size={48} />
        </View>

        {/* Workout Card */}
        {workout ? (
          <Card variant="elevated" style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <Text style={[styles.workoutTitle, { color: colors.text }]}>{workout.name}</Text>
              <Badge label={workout.difficulty} difficulty={workout.difficulty} />
            </View>

            <View style={styles.workoutMeta}>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {formatDuration(workout.estimated_duration)}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="dumbbell" size={20} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {workout.exercises?.length || 0} exercises
                </Text>
              </View>
            </View>

            <View style={styles.workoutActions}>
              <Button
                title="Start Workout"
                onPress={() =>
                  (navigation as any).navigate('ActiveWorkout', { workoutId: workout.id })
                }
                style={{ flex: 1 }}
              />
              <Button
                title="View Details"
                onPress={() =>
                  (navigation as any).navigate('WorkoutDetail', { workoutId: workout.id })
                }
                variant="outline"
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ) : (
          <Card variant="elevated" style={styles.emptyWorkoutCard}>
            <MaterialCommunityIcons name="lightning-bolt" size={48} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Generate Your Workout</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Get a personalized AI-powered workout based on your goals
            </Text>
            <Button
              title="Generate Workout"
              onPress={handleGenerateWorkout}
              style={styles.generateButton}
            />
          </Card>
        )}

        {/* Stats Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={32} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.current_streak || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </Card>

          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="chart-line" size={32} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.total_workouts || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Workouts</Text>
          </Card>

          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-week" size={32} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats?.workouts_this_week || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>This Week</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('ChatTab' as never)}
          >
            <MaterialCommunityIcons name="chat" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>AI Coach</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('WorkoutsTab' as never)}
          >
            <MaterialCommunityIcons name="view-list" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Exercise Library</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
  },
  workoutCard: {
    padding: 20,
    marginBottom: 24,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
  },
  workoutActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyWorkoutCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  generateButton: {
    minWidth: 200,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
