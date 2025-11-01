import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { getDifficultyColor } from '@/utils/helpers';
import { FitnessLevel } from '@/types';

interface BadgeProps {
  label: string;
  variant?: 'difficulty' | 'status' | 'custom';
  difficulty?: FitnessLevel;
  color?: string;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'custom', difficulty, color, style }: BadgeProps) {
  let backgroundColor = color;

  if (variant === 'difficulty' && difficulty) {
    backgroundColor = getDifficultyColor(difficulty);
  }

  return (
    <View style={[styles.badge, backgroundColor && { backgroundColor }, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#3A3A3D',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
