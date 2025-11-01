import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { useExercises } from '@/hooks/useExercises';
import { SearchBar } from '@/components/SearchBar';
import { Chip } from '@/components/Chip';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MUSCLE_GROUPS } from '@/utils/constants';
import { Exercise } from '@/types';

export function ExerciseLibraryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { exercises, loading } = useExercises();

  function toggleFilter(filter: string) {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  }

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.some(filter =>
        exercise.muscle_groups.some(group => group.toLowerCase() === filter.toLowerCase())
      );
    return matchesSearch && matchesFilter;
  });

  function renderExercise({ item }: { item: Exercise }) {
    return (
      <TouchableOpacity
        onPress={() => (navigation as any).navigate('ExerciseDetail', { exerciseId: item.id })}
      >
        <Card style={styles.exerciseCard}>
          <View style={styles.exerciseContent}>
            <View style={[styles.thumbnail, { backgroundColor: colors.surfaceVariant }]}>
              <MaterialCommunityIcons name="dumbbell" size={32} color={colors.textSecondary} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={[styles.exerciseName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.muscleGroups, { color: colors.textSecondary }]}>
                {item.muscle_groups.join(', ')}
              </Text>
              <Badge label={item.difficulty} difficulty={item.difficulty} style={styles.badge} />
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Exercise Library</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search exercises..."
        />
      </View>

      <View style={styles.filtersSection}>
        <Text style={[styles.filtersLabel, { color: colors.textSecondary }]}>
          Filter by muscle:
        </Text>
        <FlatList
          data={MUSCLE_GROUPS}
          renderItem={({ item }) => (
            <Chip
              label={item}
              selected={selectedFilters.includes(item)}
              onPress={() => toggleFilter(item)}
            />
          )}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filtersSection: {
    paddingLeft: 24,
    marginBottom: 16,
  },
  filtersLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  filtersList: {
    gap: 8,
    paddingRight: 24,
  },
  list: {
    padding: 24,
    paddingTop: 0,
  },
  exerciseCard: {
    padding: 16,
    marginBottom: 12,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  muscleGroups: {
    fontSize: 13,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
  },
});
