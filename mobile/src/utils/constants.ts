import { FitnessGoal, FitnessLevel } from '@types';

export const FITNESS_GOALS: { value: FitnessGoal; label: string; description: string }[] = [
  {
    value: 'Lose Weight',
    label: 'Lose Weight',
    description: 'Burn calories and reduce body fat',
  },
  {
    value: 'Build Muscle',
    label: 'Build Muscle',
    description: 'Increase strength and muscle mass',
  },
  {
    value: 'Improve Endurance',
    label: 'Improve Endurance',
    description: 'Boost stamina and cardiovascular health',
  },
  {
    value: 'General Fitness',
    label: 'General Fitness',
    description: 'Overall health and wellness',
  },
  {
    value: 'Increase Flexibility',
    label: 'Increase Flexibility',
    description: 'Improve range of motion and mobility',
  },
  {
    value: 'Sport Performance',
    label: 'Sport Performance',
    description: 'Enhance athletic performance',
  },
];

export const FITNESS_LEVELS: { value: FitnessLevel; label: string; description: string }[] = [
  {
    value: 'Beginner',
    label: 'Beginner',
    description: 'New to fitness or returning after a break',
  },
  {
    value: 'Intermediate',
    label: 'Intermediate',
    description: 'Comfortable with basic exercises',
  },
  {
    value: 'Advanced',
    label: 'Advanced',
    description: 'Experienced with challenging workouts',
  },
];

export const EQUIPMENT_OPTIONS = [
  { value: 'bodyweight', label: 'Bodyweight', icon: 'account' },
  { value: 'dumbbells', label: 'Dumbbells', icon: 'dumbbell' },
  { value: 'barbell', label: 'Barbell', icon: 'weight-lifter' },
  { value: 'bands', label: 'Resistance Bands', icon: 'stretch-to-page' },
  { value: 'bench', label: 'Bench', icon: 'table-furniture' },
  { value: 'pullup_bar', label: 'Pull-up Bar', icon: 'basketball-hoop' },
  { value: 'gym', label: 'Full Gym Access', icon: 'home-city' },
];

export const TIME_OPTIONS = [
  { value: 15, label: '15-30 min' },
  { value: 30, label: '30-45 min' },
  { value: 45, label: '45-60 min' },
  { value: 60, label: '60+ min' },
];

export const DAYS_PER_WEEK = [1, 2, 3, 4, 5, 6, 7];

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Full Body',
  'Cardio',
];
