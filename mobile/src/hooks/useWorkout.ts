import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { WorkoutPlan } from '@/types';

export function useWorkout(workoutId?: string) {
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workoutId) {
      loadWorkout(workoutId);
    }
  }, [workoutId]);

  async function loadWorkout(id: string) {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getWorkout(id);
      setWorkout(data);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to load workout');
    } finally {
      setLoading(false);
    }
  }

  async function generateWorkout() {
    setLoading(true);
    setError(null);

    try {
      const data = await api.generateWorkout();
      setWorkout(data);
      return data;
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to generate workout');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function completeWorkout(feedback: string, duration: number) {
    if (!workout) return;

    try {
      await api.completeWorkout(workout.id, {
        feedback,
        total_duration: duration,
      });
    } catch (err) {
      const error = err as { message?: string };
      throw new Error(error.message || 'Failed to complete workout');
    }
  }

  return {
    workout,
    loading,
    error,
    loadWorkout,
    generateWorkout,
    completeWorkout,
  };
}
