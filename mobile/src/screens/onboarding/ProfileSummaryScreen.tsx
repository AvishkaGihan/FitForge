import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Card } from '@/components/Card';
import { api } from '@/services/api';
import { storage } from '@/utils/storage';

export function ProfileSummaryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const params = route.params as any;

  async function handleComplete() {
    try {
      setLoading(true);

      const profileData = {
        fitness_goal: params.goal,
        fitness_level: params.level,
        equipment: params.equipment,
        time_per_workout: params.timePerWorkout,
        days_per_week: params.daysPerWeek,
        restrictions: params.restrictions || '',
        avoided_exercises: params.avoidedExercises || [],
        preferred_exercises: params.preferredExercises || [],
      };

      await api.updateProfile(profileData);
      await storage.setOnboardingComplete(true);

      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as never }],
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(screen: string) {
    navigation.navigate(screen as never);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.step, { color: colors.textSecondary }]}>Step 5 of 5</Text>
        <ProgressBar progress={1.0} style={styles.progressBar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Review your profile</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Everything looks good? Let's get started!
        </Text>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Goal</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{params.goal}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit('GoalSelection')}>
              <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Fitness Level
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{params.level}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit('FitnessLevel')}>
              <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Equipment</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {params.equipment?.join(', ')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit('FitnessLevel')}>
              <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Schedule</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {params.timePerWorkout} min, {params.daysPerWeek}x per week
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit('TimeFrequency')}>
              <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {params.restrictions && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <View style={styles.summaryContent}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                    Restrictions
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>
                    {params.restrictions}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleEdit('Preferences')}>
                  <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="Complete Setup"
          onPress={handleComplete}
          loading={loading}
          style={styles.button}
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
    padding: 24,
    paddingBottom: 16,
  },
  step: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  summaryCard: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  summaryContent: {
    flex: 1,
    marginRight: 16,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
