import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AvatarProps {
  name?: string;
  image?: string;
  size?: number;
}

export function Avatar({ name, image, size = 40 }: AvatarProps) {
  const { colors } = useTheme();

  const initials =
    name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: colors.primary,
        },
      ]}
    >
      {image ? (
        <Image source={{ uri: image }} style={[styles.image, { width: size, height: size }]} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 999,
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
