import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { TIME_OPTIONS, DAYS_PER_WEEK } from '@/utils/constants';

export function TimeFrequencyScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);

  function handleNext() {
    if (selectedTime && selectedDays) {
      (navigation.navigate as any)('Preferences', {
        ...route.params,
        timePerWorkout: selectedTime,
        daysPerWeek: selectedDays,
      });
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.step, { color: colors.textSecondary }]}>Step 3 of 5</Text>
        <ProgressBar progress={0.6} style={styles.progressBar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Time commitment</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          How much time can you dedicate?
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Workout duration</Text>
          <View style={styles.optionGrid}>
            {TIME_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.timeCard,
                  { backgroundColor: colors.surface },
                  selectedTime === option.value && {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSelectedTime(option.value)}
              >
                <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Days per week</Text>
          <View style={styles.daysContainer}>
            {DAYS_PER_WEEK.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  { backgroundColor: colors.surface },
                  selectedDays === day && {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => setSelectedDays(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: selectedDays === day ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Back" onPress={() => navigation.goBack()} variant="outline" />
        <Button title="Next" onPress={handleNext} disabled={!selectedTime || !selectedDays} />
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
});
