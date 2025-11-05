import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Exercise } from '@/types';

export function useExercises(filters?: Record<string, string | number | boolean>) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
  }, [filters]);

  async function loadExercises() {
    setLoading(true);
    setError(null);

    try {
      const data = filters ? await api.searchExercises(filters) : await api.getAllExercises();
      setExercises(data);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to load exercises');
    } finally {
      setLoading(false);
    }
  }

  return { exercises, loading, error, refresh: loadExercises };
}
