import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Chip } from '@/components/Chip';
import { FITNESS_LEVELS, EQUIPMENT_OPTIONS } from '@/utils/constants';
import { FitnessLevel } from '@/types';

export function FitnessLevelScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  function toggleEquipment(value: string) {
    setSelectedEquipment(prev =>
      prev.includes(value) ? prev.filter(e => e !== value) : [...prev, value]
    );
  }

  function handleNext() {
    if (selectedLevel && selectedEquipment.length > 0) {
      (navigation as any).navigate('TimeFrequency', {
        ...route.params,
        level: selectedLevel,
        equipment: selectedEquipment,
      });
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.step, { color: colors.textSecondary }]}>Step 2 of 5</Text>
        <ProgressBar progress={0.4} style={styles.progressBar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Your fitness level</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Help us tailor workouts to your experience
        </Text>

        <View style={styles.section}>
          {FITNESS_LEVELS.map(level => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.levelCard,
                { backgroundColor: colors.surface },
                selectedLevel === level.value && {
                  borderColor: colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedLevel(level.value)}
            >
              <Text style={[styles.levelTitle, { color: colors.text }]}>{level.label}</Text>
              <Text style={[styles.levelDescription, { color: colors.textSecondary }]}>
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available equipment</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select all that apply
        </Text>

        <View style={styles.chipContainer}>
          {EQUIPMENT_OPTIONS.map(option => (
            <Chip
              key={option.value}
              label={option.label}
              icon={option.icon}
              selected={selectedEquipment.includes(option.value)}
              onPress={() => toggleEquipment(option.value)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Back" onPress={() => navigation.goBack()} variant="outline" />
        <Button
          title="Next"
          onPress={handleNext}
          disabled={!selectedLevel || selectedEquipment.length === 0}
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
  section: {
    gap: 12,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  levelCard: {
    padding: 16,
    borderRadius: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
});
