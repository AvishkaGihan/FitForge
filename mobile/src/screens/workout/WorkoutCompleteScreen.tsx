import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';

const DIFFICULTY_OPTIONS = [
  { value: 'too_easy', label: 'Too Easy', icon: 'emoticon-sad', color: '#06FFA5' },
  { value: 'just_right', label: 'Just Right', icon: 'emoticon-happy', color: '#FFBE0B' },
  { value: 'too_hard', label: 'Too Hard', icon: 'emoticon-dead', color: '#FF006E' },
];

export function WorkoutCompleteScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSequence(withSpring(1.2, { damping: 10 }), withSpring(1, { damping: 10 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handleFinish() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' as never }],
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <MaterialCommunityIcons name="check-circle" size={100} color={colors.success} />
        </Animated.View>

        <Text style={[styles.title, { color: colors.text }]}>Workout Complete!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Great job! You've crushed it today 💪
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={32} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>35:24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fire" size={32} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>~285</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="dumbbell" size={32} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</Text>
          </View>
        </View>

        <View style={styles.feedbackSection}>
          <Text style={[styles.feedbackTitle, { color: colors.text }]}>How was this workout?</Text>
          <View style={styles.difficultyOptions}>
            {DIFFICULTY_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.difficultyCard,
                  { backgroundColor: colors.surface },
                  selectedDifficulty === option.value && {
                    borderColor: option.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSelectedDifficulty(option.value)}
              >
                <MaterialCommunityIcons
                  name={option.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                  size={40}
                  color={selectedDifficulty === option.value ? option.color : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.difficultyLabel,
                    {
                      color:
                        selectedDifficulty === option.value ? colors.text : colors.textSecondary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Done" onPress={handleFinish} size="large" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  feedbackSection: {
    width: '100%',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  difficultyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  difficultyLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
  },
});
