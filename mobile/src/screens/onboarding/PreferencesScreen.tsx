import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Chip } from '@/components/Chip';

const AVOID_EXERCISES = [
  'Running',
  'Jumping',
  'Heavy Squats',
  'Overhead Press',
  'Burpees',
  'High Impact',
];

const PREFERRED_TYPES = [
  'Cardio',
  'Strength Training',
  'HIIT',
  'Yoga/Stretching',
  'Sports-specific',
  'Functional Training',
];

export function PreferencesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [restrictions, setRestrictions] = useState('');
  const [avoidedExercises, setAvoidedExercises] = useState<string[]>([]);
  const [preferredTypes, setPreferredTypes] = useState<string[]>([]);

  function toggleAvoided(exercise: string) {
    setAvoidedExercises(prev =>
      prev.includes(exercise) ? prev.filter(e => e !== exercise) : [...prev, exercise]
    );
  }

  function togglePreferred(type: string) {
    setPreferredTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  function handleNext() {
    (navigation.navigate as any)('ProfileSummary', {
      ...route.params,
      restrictions,
      avoidedExercises,
      preferredExercises: preferredTypes,
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.step, { color: colors.textSecondary }]}>Step 4 of 5</Text>
        <ProgressBar progress={0.8} style={styles.progressBar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Your preferences</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Help us personalize your workouts (all optional)
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Physical restrictions or injuries
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
            ]}
            value={restrictions}
            onChangeText={setRestrictions}
            placeholder="e.g., knee pain, shoulder injury, lower back issues"
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {restrictions.length}/500
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises to avoid</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select any exercises you want to skip
          </Text>
          <View style={styles.chipContainer}>
            {AVOID_EXERCISES.map(exercise => (
              <Chip
                key={exercise}
                label={exercise}
                selected={avoidedExercises.includes(exercise)}
                onPress={() => toggleAvoided(exercise)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferred exercise types
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            What do you enjoy most?
          </Text>
          <View style={styles.chipContainer}>
            {PREFERRED_TYPES.map(type => (
              <Chip
                key={type}
                label={type}
                selected={preferredTypes.includes(type)}
                onPress={() => togglePreferred(type)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.button}
        />
        <Button title="Next" onPress={handleNext} style={styles.button} />
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
