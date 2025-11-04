import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { formatDuration, formatDate } from '@/utils/helpers';
import { WorkoutPlan, HomeStackParamList } from '@/types';
import { api } from '@/services/api';

export function WorkoutsListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const [selectedTab, setSelectedTab] = useState<'my' | 'library'>('my');
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch workouts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadWorkouts();
    }, [])
  );

  async function loadWorkouts() {
    try {
      setError(null);
      const data = await api.getUserWorkouts(20);
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch workouts');
      console.error('Error loading workouts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      await loadWorkouts();
    } finally {
      setRefreshing(false);
    }
  }

  function renderWorkout({ item }: { item: WorkoutPlan }) {
    return (
      <Card style={styles.workoutCard}>
        <TouchableOpacity
          onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
        >
          <Text style={[styles.workoutName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.workoutMeta}>
            <Badge label={item.difficulty} difficulty={item.difficulty} />
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {formatDuration(item.estimated_duration)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {formatDate(item.created_at)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Workouts</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'my' && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setSelectedTab('my')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'my' ? colors.primary : colors.textSecondary },
            ]}
          >
            My Workouts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'library' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setSelectedTab('library')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'library' ? colors.primary : colors.textSecondary },
            ]}
          >
            Exercise Library
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'my' ? (
        <>
          {loading && !refreshing ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadWorkouts} />
          ) : (
            <FlatList
              data={workouts}
              renderItem={renderWorkout}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary}
                />
              }
              ListEmptyComponent={
                <EmptyState
                  icon="dumbbell"
                  title="No workouts yet"
                  description="Generate your first AI-powered workout"
                  actionLabel="Generate Workout"
                  onAction={() => navigation.navigate('HomeTab' as never)}
                />
              }
            />
          )}
        </>
      ) : (
        <View style={styles.libraryContainer}>
          <Button
            title="Browse Exercise Library"
            onPress={() => navigation.navigate('ExerciseLibrary' as never)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 24,
    paddingTop: 8,
  },
  workoutCard: {
    padding: 16,
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  libraryContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});
