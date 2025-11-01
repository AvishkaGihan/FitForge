import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  const { colors } = useTheme();

  return <View style={[styles.divider, { backgroundColor: colors.border }, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
