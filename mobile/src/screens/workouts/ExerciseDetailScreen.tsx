import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { api } from '@/services/api';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getMuscleGroupColor } from '@/utils/helpers';
import { Exercise } from '@/types';

const { width } = Dimensions.get('window');

export function ExerciseDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { exerciseId } = route.params as { exerciseId: string };
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, [exerciseId]);

  async function loadExercise() {
    try {
      const data = await api.getExercise(exerciseId);
      setExercise(data);
    } catch (error) {
      console.error('Failed to load exercise:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text>Exercise not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Exercise Details</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="heart-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video/Image Placeholder */}
        <View style={[styles.mediaContainer, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons name="play-circle" size={64} color={colors.primary} />
          <Text style={[styles.mediaText, { color: colors.textSecondary }]}>
            Video demonstration
          </Text>
        </View>

        {/* Exercise Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
          <Badge
            label={exercise.difficulty}
            difficulty={exercise.difficulty}
            style={styles.badge}
          />

          {exercise.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {exercise.description}
            </Text>
          )}
        </View>

        {/* Muscle Groups */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Target Muscles</Text>
          <View style={styles.muscleGroups}>
            {exercise.muscle_groups.map((group, index) => (
              <View
                key={index}
                style={[styles.muscleTag, { backgroundColor: getMuscleGroupColor(group) + '20' }]}
              >
                <View style={[styles.muscleDot, { backgroundColor: getMuscleGroupColor(group) }]} />
                <Text style={[styles.muscleText, { color: colors.text }]}>{group}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Equipment */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Equipment Needed</Text>
          <View style={styles.equipmentList}>
            {exercise.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                <Text style={[styles.equipmentText, { color: colors.text }]}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>How To Perform</Text>
          <Card style={styles.instructionsCard}>
            <Text style={[styles.instructions, { color: colors.textSecondary }]}>
              {exercise.instructions}
            </Text>
          </Card>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pro Tips 💡</Text>
          <Card style={styles.tipsCard}>
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              • Focus on proper form over heavy weight{'\n'}• Breathe steadily throughout the
              movement{'\n'}• Warm up before attempting heavy sets{'\n'}• Listen to your body and
              stop if you feel pain
            </Text>
          </Card>
        </View>
      </ScrollView>
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
  },
  mediaContainer: {
    width: width,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaText: {
    fontSize: 14,
    marginTop: 12,
  },
  infoSection: {
    padding: 24,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  badge: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  muscleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  muscleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  muscleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  equipmentList: {
    gap: 12,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  equipmentText: {
    fontSize: 16,
  },
  instructionsCard: {
    padding: 16,
  },
  instructions: {
    fontSize: 15,
    lineHeight: 24,
  },
  tipsCard: {
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
