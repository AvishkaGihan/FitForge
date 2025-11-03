import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { FITNESS_GOALS } from '@/utils/constants';
import { FitnessGoal } from '@/types';

export function GoalSelectionScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);

  function handleNext() {
    if (selectedGoal) {
      (navigation.navigate as any)('FitnessLevel', { goal: selectedGoal });
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.step, { color: colors.textSecondary }]}>Step 1 of 5</Text>
        <ProgressBar progress={0.2} style={styles.progressBar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>What's your primary goal?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose the goal that matters most to you
        </Text>

        <View style={styles.options}>
          {FITNESS_GOALS.map(goal => (
            <TouchableOpacity
              key={goal.value}
              style={[
                styles.card,
                { backgroundColor: colors.surface },
                selectedGoal === goal.value && {
                  borderColor: colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedGoal(goal.value)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="target"
                size={32}
                color={selectedGoal === goal.value ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.cardTitle, { color: colors.text }]}>{goal.label}</Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {goal.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Next" onPress={handleNext} disabled={!selectedGoal} style={styles.button} />
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
  options: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
  },
  button: {
    width: '100%',
  },
});
