import { FitnessLevel } from '@/types';

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString();
}

export function calculateCalories(duration: number, intensity: 'low' | 'medium' | 'high'): number {
  const mets = { low: 3, medium: 6, high: 9 };
  const weight = 70; // Average weight in kg
  const hours = duration / 60;
  return Math.round(mets[intensity] * weight * hours);
}

export function getDifficultyColor(difficulty: FitnessLevel): string {
  switch (difficulty) {
    case 'Beginner':
      return '#06FFA5';
    case 'Intermediate':
      return '#FFBE0B';
    case 'Advanced':
      return '#FF006E';
    default:
      return '#6E6E73';
  }
}

export function getMuscleGroupColor(group: string): string {
  const colors: Record<string, string> = {
    chest: '#FF6B35',
    back: '#3B82F6',
    shoulders: '#8B5CF6',
    arms: '#EC4899',
    legs: '#10B981',
    core: '#F59E0B',
    cardio: '#EF4444',
    full_body: '#06FFA5',
  };
  return colors[group.toLowerCase()] || '#6E6E73';
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '').substring(0, 500);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
